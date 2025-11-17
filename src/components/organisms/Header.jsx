import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
const Header = ({ 
  searchQuery, 
  onSearchChange, 
  onSearchClear,
  onAddBookmark,
  onToggleMobileSidebar,
  title = "All Bookmarks" 
}) => {
  const navigate = useNavigate();
  return (
    <header className="bg-surface border-b border-slate-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu + Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            
            {/* Logo and title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Bookmark" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 hidden sm:block">DevVault</h1>
                <p className="text-sm text-slate-600 hidden md:block">{title}</p>
              </div>
            </div>
</div>

          {/* Right side - Search and Add button */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                onClear={onSearchClear}
                className="w-64 md:w-80"
              />
            </div>
            
            <Button 
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="p-2"
              title="Settings"
            >
              <ApperIcon name="Settings" className="w-4 h-4" />
            </Button>

            <Button onClick={onAddBookmark} className="flex items-center space-x-2">
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">Add Bookmark</span>
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="sm:hidden mt-4">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onSearchClear}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;