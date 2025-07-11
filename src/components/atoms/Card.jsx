import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "glass-card transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;