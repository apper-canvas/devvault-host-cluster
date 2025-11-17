import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    primary: "bg-gradient-to-r from-primary to-accent text-white shadow-sm",
    secondary: "bg-slate-200 text-slate-900",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    error: "bg-red-100 text-red-800 border-red-200",
    docs: "bg-blue-100 text-blue-800 border-blue-200",
    tools: "bg-purple-100 text-purple-800 border-purple-200",
    tutorials: "bg-green-100 text-green-800 border-green-200",
    references: "bg-orange-100 text-orange-800 border-orange-200",
    repos: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 hover:scale-105",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;