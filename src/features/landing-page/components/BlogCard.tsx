import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/features/landing-page/data/posts";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <Card className="transition-all hover:border-primary/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <IconLibrary name="calendar" className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <IconLibrary name="member" className="h-3 w-3" />
            {post.author}
          </span>
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Read more <IconLibrary name="arrow-right" className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
