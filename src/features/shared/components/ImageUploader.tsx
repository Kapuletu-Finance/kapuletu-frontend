"use client";

import { Image as ImageIcon, Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  isLoading?: boolean;
  className?: string;
  shape?: "square" | "circle" | "video";
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onFileSelect,
  onClear,
  isLoading = false,
  className,
  shape = "square",
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Pass to parent
    onFileSelect(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClear?.();
  };

  const displayUrl = preview || currentImageUrl;

  const fullImageUrl = displayUrl
    ? displayUrl.startsWith("http") || displayUrl.startsWith("blob:")
      ? displayUrl
      : `/api${displayUrl}`
    : null;

  return (
    <div
      className={cn(
        "relative group cursor-pointer border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center overflow-hidden bg-muted/30",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        className,
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      {fullImageUrl ? (
        <>
          <img
            src={fullImageUrl}
            alt="Preview"
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isLoading ? "opacity-50" : "group-hover:opacity-80",
            )}
          />
          {!isLoading && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
          )}
          {onClear && !isLoading && (
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Click to upload image</p>
          <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
