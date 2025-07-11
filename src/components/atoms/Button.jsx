import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white border-transparent shadow-lg hover:shadow-xl",
    secondary: "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm",
    outline: "border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300",
    ghost: "hover:bg-white/10 text-gray-800 hover:text-black",
    danger: "bg-red-500 hover:bg-red-600 text-white border-transparent",
    success: "bg-green-500 hover:bg-green-600 text-white border-transparent shadow-lg hover:shadow-xl",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;