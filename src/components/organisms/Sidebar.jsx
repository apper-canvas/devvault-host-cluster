import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const Sidebar = ({ 
  collections = [], 
  tags = [],
  isOpen = false,
  onClose,
  className
}) => {
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

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-6 custom-scrollbar overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Navigation
          </h3>
          <div className="space-y-1">
            <NavLink
              to=""
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-3 border-primary"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <ApperIcon name="Home" className="w-4 h-4" />
              <span className="font-medium">All Bookmarks</span>
            </NavLink>
            
            <NavLink
              to="recent"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-3 border-primary"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span className="font-medium">Recent</span>
            </NavLink>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collections
            </h3>
            <ApperIcon name="Plus" className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
          
          <div className="space-y-1">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <NavLink
                  key={collection.Id}
                  to={`collection/${collection.Id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-3 border-primary"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )
                  }
                >
                  <ApperIcon name="Folder" className="w-4 h-4" />
                  <span className="flex-1 font-medium truncate">{collection.name}</span>
                  {collection.bookmarkCount > 0 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0">
                      {collection.bookmarkCount}
                    </Badge>
                  )}
                </NavLink>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-slate-500 text-center">
                No collections yet
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tags
            </h3>
          </div>
          
          <div className="space-y-1">
            {tags.length > 0 ? (
              tags.slice(0, 10).map((tag) => (
                <NavLink
                  key={tag.Id}
                  to={`tag/${encodeURIComponent(tag.name)}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-3 border-primary"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )
                  }
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    tag.category === "docs" && "bg-blue-500",
                    tag.category === "tools" && "bg-purple-500",
                    tag.category === "tutorials" && "bg-green-500",
                    tag.category === "references" && "bg-orange-500",
                    tag.category === "repos" && "bg-gray-500",
                    tag.category === "custom" && "bg-primary"
                  )} />
                  <span className="flex-1 font-medium truncate">{tag.name}</span>
                  {tag.usageCount > 0 && (
                    <span className="text-xs text-slate-400">{tag.usageCount}</span>
                  )}
                </NavLink>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-slate-500 text-center">
                No tags yet
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-3 text-sm text-slate-600">
          <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded flex items-center justify-center">
            <ApperIcon name="Zap" className="w-3 h-3 text-white" />
          </div>
          <div>
            <p className="font-medium">DevVault</p>
            <p className="text-xs text-slate-500">Bookmark Manager</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block w-64 bg-surface border-r border-slate-200 h-screen sticky top-0", className)}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-surface border-r border-slate-200 z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <ApperIcon name="Bookmark" className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">DevVault</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;