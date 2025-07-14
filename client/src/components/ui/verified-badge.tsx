import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  isVerified?: boolean;
  isAI?: boolean;
  className?: string;
}

export function VerifiedBadge({ isVerified, isAI, className }: VerifiedBadgeProps) {
  if (!isVerified && !isAI) return null;

  return (
    <div className={cn("inline-flex items-center", className)}>
      <CheckCircle 
        className={cn(
          "h-4 w-4",
          isAI ? "text-blue-500 fill-blue-500" : "text-green-500 fill-green-500"
        )} 
      />
    </div>
  );
}