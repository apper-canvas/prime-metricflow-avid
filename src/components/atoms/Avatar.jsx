import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ className, src, alt, fallback, size = "default", ...props }, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    default: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-secondary-500",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/10 text-white font-medium">
          {fallback}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;