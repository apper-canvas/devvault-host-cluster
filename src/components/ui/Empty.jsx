import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No bookmarks yet", 
  description = "Start building your development resource library by adding your first bookmark.",
  actionText = "Add Bookmark",
  onAction,
  icon = "Bookmark"
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-full mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <div className="space-y-4">
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-primary to-accent hover:from-blue-700 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              {actionText}
            </Button>
            
            <div className="flex items-center justify-center space-x-6 pt-4">
              <div className="flex items-center text-sm text-slate-500">
                <ApperIcon name="Zap" className="w-4 h-4 mr-1 text-amber-500" />
                Quick add with ⌘+K
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <ApperIcon name="Search" className="w-4 h-4 mr-1 text-blue-500" />
                Search with ⌘+F
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Empty;