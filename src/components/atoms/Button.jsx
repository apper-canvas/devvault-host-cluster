import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg focus:ring-primary transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 hover:border-slate-400 focus:ring-slate-500",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 focus:ring-slate-500",
    ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500 transform hover:scale-[1.02] active:scale-[0.98]",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    default: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;