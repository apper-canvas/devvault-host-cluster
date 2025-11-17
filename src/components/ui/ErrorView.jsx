import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ error, onRetry, title = "Something went wrong" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-red-50 flex items-center justify-center p-6">
      <div className="bg-surface rounded-2xl border border-red-200 p-8 max-w-md w-full text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full mb-6">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          {title}
        </h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {error || "We encountered an unexpected error while loading your bookmarks. Please try again or contact support if the problem persists."}
        </p>
        
        <div className="space-y-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@devvault.dev" className="text-primary hover:text-accent underline">
              support@devvault.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;