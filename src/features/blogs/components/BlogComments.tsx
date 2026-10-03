"use client";

import { format } from "date-fns";
import { MessageSquare, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBlogCommentMutation as createMutationAlias } from "../services/mutations";
import { useGetPublicBlogCommentsQuery } from "../services/queries";

interface Props {
  postId: string;
}

export const BlogComments: React.FC<Props> = ({ postId }) => {
  const { data: comments, isLoading } = useGetPublicBlogCommentsQuery(postId);
  const createCommentMutation = createMutationAlias();

  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        data: {
          post_id: postId,
          content,
          guest_name: guestName.trim() || undefined,
        },
      });
      setContent("");
      toast.success("Comment submitted! It will appear once approved by a moderator.");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to submit comment.");
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-border" id="comments">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        Discussion
      </h3>

      <div className="bg-muted/30 rounded-2xl p-6 mb-10 border shadow-sm">
        <h4 className="font-semibold mb-4">Leave a Reply</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your Name (Optional)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="max-w-xs"
          />
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            required
          />
          <Button type="submit" disabled={!content.trim() || createCommentMutation.isPending}>
            {createCommentMutation.isPending ? "Submitting..." : "Post Comment"}
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading comments...</div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="bg-muted/20 border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">
                      {comment.guest_name || "Registered User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
