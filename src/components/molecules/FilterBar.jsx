import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  totalCount = 0,
  selectedTags = [],
  onTagRemove,
  onClearFilters,
  viewMode = "grid",
  onViewModeChange,
  sortBy = "createdAt",
  onSortChange,
  hasFilters = false
}) => {
  const sortOptions = [
    { value: "createdAt", label: "Recent", icon: "Clock" },
    { value: "title", label: "Title", icon: "Type" },
    { value: "url", label: "URL", icon: "Link" },
  ];

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left side - Filters and count */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700">
          {totalCount} bookmark{totalCount !== 1 ? 's' : ''}
        </span>
        
        {selectedTags.length > 0 && (
          <>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.Id}
                  variant={getCategoryVariant(tag.category)}
                  className="flex items-center gap-1 cursor-default"
                >
                  {tag.name}
                  <button
                    onClick={() => onTagRemove(tag)}
                    className="ml-1 hover:bg-white/20 rounded-sm p-0.5 transition-colors"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </>
        )}
        
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Right side - View and sort controls */}
      <div className="flex items-center gap-3">
        {/* Sort dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-slate-600 hidden sm:inline">Sort:</span>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className="rounded-none border-0 px-3 py-1.5"
              >
                <ApperIcon name={option.icon} className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* View mode toggle */}
        <div className="flex rounded-lg border border-slate-300 overflow-hidden">
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-none border-0 px-3 py-1.5"
          >
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-none border-0 px-3 py-1.5"
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;