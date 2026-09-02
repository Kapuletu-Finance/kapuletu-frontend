'use client';
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export const DocsFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  if (feedback) {
    return (
      <div className="my-10 p-6 border border-border rounded-lg bg-muted/20 text-center">
        <p className="text-sm font-medium text-foreground">Thank you for your feedback!</p>
        <p className="text-xs text-muted-foreground mt-1">This helps us improve KapuLetu documentation.</p>
      </div>
    );
  }

  return (
    <div className="my-10 py-6 border-t border-border flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">Was this helpful?</span>
      <div className="flex gap-3">
        <button 
          onClick={() => setFeedback('yes')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-border/50"
        >
          <ThumbsUp className="w-4 h-4" /> Yes
        </button>
        <button 
          onClick={() => setFeedback('no')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-border/50"
        >
          <ThumbsDown className="w-4 h-4" /> No
        </button>
      </div>
    </div>
  );
};
