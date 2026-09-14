import type React from "react";

interface DocsVideoProps {
  title?: string;
  duration?: string;
}

export const DocsVideo: React.FC<DocsVideoProps> = ({ title, duration }) => {
  return (
    <div className="my-8 rounded-lg overflow-hidden border border-border bg-muted/20">
      <div className="aspect-video relative bg-black/5 flex items-center justify-center">
        <video controls className="w-full h-full object-cover" poster="/shared/screenshot.png">
          <source src="/shared/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {(title || duration) && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-card">
          <span className="font-medium text-sm text-foreground">{title || "Video Tutorial"}</span>
          {duration && <span className="text-xs text-muted-foreground">{duration}</span>}
        </div>
      )}
    </div>
  );
};
