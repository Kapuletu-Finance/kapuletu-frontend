export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  author_name: string | null;
  author_role: string | null;
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
  author_name?: string | null;
  author_role?: string | null;
  is_published: boolean;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}
