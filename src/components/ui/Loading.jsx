import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-64 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Skeleton */}
          <div className="w-64 bg-surface rounded-xl border border-slate-200 p-6 h-[calc(100vh-120px)] animate-pulse">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                      <div className="w-24 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                      <div className="w-6 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full ml-auto"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
                      <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                      <div className="w-4 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full ml-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Filter Bar Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-16 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Bookmark Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-surface rounded-lg border border-slate-200 p-6 animate-pulse">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                    <div className="flex-1">
                      <div className="w-3/4 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2"></div>
                      <div className="w-full h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded font-mono"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                    <div className="w-2/3 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-16 h-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                    <div className="w-6 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;