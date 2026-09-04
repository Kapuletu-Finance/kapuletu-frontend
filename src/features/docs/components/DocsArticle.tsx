import type React from "react";

interface DocsArticleProps {
  title: string;
  description?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime?: string;
  role?: "Treasurer" | "Assistant Treasurer" | "Admin";
  children: React.ReactNode;
}

export const DocsArticle: React.FC<DocsArticleProps> = ({
  title,
  description,
  difficulty,
  estimatedTime,
  role = "Treasurer",
  children,
}) => {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed">
      <header className="mb-10 pb-8 border-b border-border/50">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 mb-4 leading-tight pb-1">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {difficulty && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                difficulty === "Beginner"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {difficulty}
            </span>
          )}
          {estimatedTime && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {estimatedTime}
            </span>
          )}
          {role && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border text-muted-foreground">
              {role}
            </span>
          )}
        </div>
      </header>

      <div className="mt-8 space-y-8">{children}</div>
    </article>
  );
};
