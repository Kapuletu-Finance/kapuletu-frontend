export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  author_name: string | null;
  author_role: string | null;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  category?: string | null;
  tags?: string[];
  author_name?: string | null;
  author_role?: string | null;
  is_published: boolean;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}

export interface BlogComment {
  id: string;
  post_id: string;
  parent_id: string | null;
  user_id: string | null;
  guest_name: string | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface BlogCommentCreate {
  post_id: string;
  parent_id?: string | null;
  guest_name?: string | null;
  content: string;
}
