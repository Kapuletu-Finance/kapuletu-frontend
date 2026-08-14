import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ComingSoon: React.FC = () => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[60vh] p-8")}>
      <Card className="flex flex-col items-center justify-center p-12 max-w-xl text-center bg-card/50 backdrop-blur-sm border-dashed border-2 border-primary/20 shadow-lg">
        <div className="relative mb-8 w-64 h-64 max-w-full">
          <Image 
            src="/shared/coming-soon.svg" 
            alt="Coming Soon Illustration" 
            fill
            className="object-contain" 
            priority
          />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Coming Soon
        </h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          We're putting the finishing touches on this feature to ensure it delivers a seamless experience. 
          Check back soon to see what we've built!
        </p>
      </Card>
    </div>
  );
};

export default ComingSoon;
