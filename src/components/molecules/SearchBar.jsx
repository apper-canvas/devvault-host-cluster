import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search bookmarks...", 
  value = "", 
  onChange,
  onClear,
  className,
  showShortcut = true 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" 
        />
        
        <Input
          data-search-input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-20 h-10 bg-surface border-slate-300 focus:border-primary focus:ring-primary transition-all duration-200"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {value && (
            <button
              onClick={onClear}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ApperIcon name="X" className="w-3 h-3 text-slate-400 hover:text-slate-600" />
            </button>
          )}
          
          {showShortcut && !isFocused && !value && (
            <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded border">
              <span>⌘</span>
              <span>K</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;