import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BookmarkCard = ({ 
  bookmark, 
  onEdit, 
  onDelete, 
  onSelect,
  isSelected = false,
  showSelectCheckbox = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleOpenUrl = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      // Toast notification would be shown here
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "bg-surface rounded-lg border border-slate-200 p-6 transition-all duration-200 cursor-pointer group relative",
        isSelected && "ring-2 ring-primary border-primary bg-blue-50/30",
        isHovered && "shadow-lg border-slate-300"
      )}
    >
      {/* Selection Checkbox */}
      {showSelectCheckbox && (
        <div className="absolute top-4 left-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(bookmark);
            }}
            className={cn(
              "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
              isSelected 
                ? "bg-primary border-primary text-white" 
                : "border-slate-300 hover:border-primary bg-surface"
            )}
          >
            {isSelected && <ApperIcon name="Check" className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Header */}
      <div className={cn("flex items-start space-x-4 mb-4", showSelectCheckbox && "ml-8")}>
        <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded flex items-center justify-center flex-shrink-0">
          {bookmark.favicon ? (
            <img src={bookmark.favicon} alt="" className="w-4 h-4" onError={(e) => e.target.style.display = 'none'} />
          ) : (
            <ApperIcon name="Globe" className="w-4 h-4 text-slate-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
            {bookmark.title}
          </h3>
          <p className="text-xs text-slate-500 font-mono truncate mt-1">
            {bookmark.url}
          </p>
        </div>
        
        {/* Actions Menu */}
        <div className={cn("opacity-0 group-hover:opacity-100 transition-opacity", isSelected && "opacity-100")}>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenUrl();
              }}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              title="Open in new tab"
            >
              <ApperIcon name="ExternalLink" className="w-4 h-4 text-slate-500" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl();
              }}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              title="Copy URL"
            >
              <ApperIcon name="Copy" className="w-4 h-4 text-slate-500" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(bookmark);
              }}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              title="Edit bookmark"
            >
              <ApperIcon name="Edit2" className="w-4 h-4 text-slate-500" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(bookmark);
              }}
              className="p-1.5 hover:bg-red-50 rounded transition-colors"
              title="Delete bookmark"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {/* Tags */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bookmark.tags.slice(0, 3).map((tagName) => {
            // Find the tag object to get category info
            const tag = { name: tagName, category: "custom" }; // Default fallback
            return (
              <Badge key={tagName} variant={getCategoryVariant(tag.category)} className="text-xs">
                {tagName}
              </Badge>
            );
          })}
          {bookmark.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{bookmark.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
        </span>
        
        <div className="flex items-center space-x-2">
          {bookmark.collectionId && (
            <div className="flex items-center">
              <ApperIcon name="Folder" className="w-3 h-3 mr-1" />
              <span>Collection</span>
            </div>
          )}
        </div>
      </div>

      {/* Click handler for the whole card */}
      <div 
        className="absolute inset-0 rounded-lg"
        onClick={handleOpenUrl}
      />
    </motion.div>
  );
};

export default BookmarkCard;