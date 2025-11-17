import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-vertical",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;