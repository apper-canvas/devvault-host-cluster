import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { bookmarkService, collectionService, tagService } from "@/services/api";
import settingsService from "@/services/api/settingsService";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    loadThemePreference();
    loadSidebarData();
  }, []);

  const loadThemePreference = async () => {
    try {
      const preferences = await settingsService.getPreferences();
      setTheme(preferences.theme || "light");
      applyTheme(preferences.theme || "light");
    } catch (err) {
      console.error("Failed to load theme preference:", err);
      applyTheme("light");
    }
  };

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (themeName === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(themeName);
    }
    setTheme(themeName);
  };

  const loadSidebarData = async () => {
    try {
      const [collectionsData, tagsData] = await Promise.all([
        collectionService.getCollections(),
        tagService.getTags(),
      ]);
      setCollections(collectionsData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to load sidebar data:", error);
      toast.error("Failed to load sidebar data");
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
            refreshSidebarData: loadSidebarData,
            theme,
            applyTheme
          }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;