"use client";

interface BlogContentProps {
  content: string;
  paragraphs: string[];
}

export const BlogContent = ({ paragraphs }: BlogContentProps) => {
  return (
    <div className="space-y-6">
      {paragraphs.map((line) => {
        if (line.startsWith("## ")) {
          return (
            <h2
              key={`heading-${line.slice(3)}`}
              className="text-2xl font-bold mt-10 mb-4 text-foreground"
            >
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li
              key={`item-${line.slice(2)}`}
              className="text-muted-foreground leading-relaxed ml-4"
            >
              {line.replace(/^- /, "")}
            </li>
          );
        }
        if (/^\d+\./.test(line)) {
          return (
            <li
              key={`numbered-${line}`}
              className="text-muted-foreground leading-relaxed ml-4 list-decimal"
            >
              {line.replace(/^\d+\.\s*/, "")}
            </li>
          );
        }
        return (
          <p key={`para-${line}`} className="text-muted-foreground leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
};
