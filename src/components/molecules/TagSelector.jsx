import React, { useState, useRef, useEffect } from "react";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TagSelector = ({ 
  selectedTags = [], 
  availableTags = [], 
  onChange,
  placeholder = "Add tags...",
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredTags, setFilteredTags] = useState(availableTags);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const filtered = availableTags.filter(tag => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some(selected => selected.Id === tag.Id)
    );
    setFilteredTags(filtered);
  }, [inputValue, availableTags, selectedTags]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setInputValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTagSelect = (tag) => {
    const newSelectedTags = [...selectedTags, tag];
    onChange(newSelectedTags);
    setInputValue("");
  };

  const handleTagRemove = (tagToRemove) => {
    const newSelectedTags = selectedTags.filter(tag => tag.Id !== tagToRemove.Id);
    onChange(newSelectedTags);
  };

  const handleCreateTag = () => {
    if (inputValue.trim() && !availableTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase())) {
      const newTag = {
        Id: Date.now(),
        name: inputValue.trim(),
        color: "primary",
        category: "custom",
        usageCount: 0
      };
      const newSelectedTags = [...selectedTags, newTag];
      onChange(newSelectedTags);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredTags.length > 0) {
        handleTagSelect(filteredTags[0]);
      } else {
        handleCreateTag();
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      handleTagRemove(selectedTags[selectedTags.length - 1]);
    }
  };

  const getCategoryVariant = (category) => {
    const categoryMap = {
      docs: "docs",
      tools: "tools", 
      tutorials: "tutorials",
      references: "references",
      repos: "repos",
      custom: "primary"
    };
    return categoryMap[category] || "default";
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div 
        className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200 cursor-text"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-1.5 items-center">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.Id}
              variant={getCategoryVariant(tag.category)}
              className="flex items-center gap-1 cursor-default"
            >
              {tag.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTagRemove(tag);
                }}
                className="ml-1 hover:bg-white/20 rounded-sm p-0.5 transition-colors"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedTags.length === 0 ? placeholder : ""}
            className="border-none bg-transparent p-0 h-auto min-w-[120px] flex-1 focus:ring-0 focus:outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-slate-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredTags.length > 0 ? (
            <div className="p-2">
              {filteredTags.map((tag) => (
                <button
                  key={tag.Id}
                  onClick={() => handleTagSelect(tag)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2">
                    <Badge variant={getCategoryVariant(tag.category)} className="text-xs">
                      {tag.name}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {tag.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-600">
                    {tag.usageCount} uses
                  </span>
                </button>
              ))}
            </div>
          ) : inputValue.trim() ? (
            <div className="p-2">
              <Button
                onClick={handleCreateTag}
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2 text-primary" />
                Create "{inputValue}"
              </Button>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">
              Type to search or create tags
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;