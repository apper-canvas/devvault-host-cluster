import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-surface rounded-2xl border border-slate-200 p-12 max-w-md w-full text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-full mb-8">
          <ApperIcon name="Search" className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate("")}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-blue-700 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go to All Bookmarks
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-center space-x-6">
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
      </div>
    </div>
  );
};

export default NotFound;