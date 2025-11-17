import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import bookmarkService from "@/services/api/bookmarkService";
import collectionService from "@/services/api/collectionService";
import tagService from "@/services/api/tagService";

const Layout = () => {
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    try {
      const [collectionsData, tagsData] = await Promise.all([
        collectionService.getAll(),
        tagService.getAll()
      ]);
      
      setCollections(collectionsData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar
          collections={collections}
          tags={tags}
          isOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
        />
        
        <main className="flex-1 min-w-0">
          <Outlet context={{ 
            onToggleMobileSidebar: () => setIsMobileSidebarOpen(true),
            refreshSidebarData: loadSidebarData
          }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;