import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { subDays, isAfter } from "date-fns";
import Header from "@/components/organisms/Header";
import FilterBar from "@/components/molecules/FilterBar";
import BookmarkCard from "@/components/molecules/BookmarkCard";
import AddBookmarkModal from "@/components/organisms/AddBookmarkModal";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import bookmarkService from "@/services/api/bookmarkService";
import tagService from "@/services/api/tagService";
import collectionService from "@/services/api/collectionService";

const Recent = () => {
  const { onToggleMobileSidebar, refreshSidebarData } = useOutletContext();
  
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("createdAt");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  
  const [availableTags, setAvailableTags] = useState([]);
  const [collections, setCollections] = useState([]);

  const RECENT_DAYS = 7; // Show bookmarks from last 7 days

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, selectedTags, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [allBookmarks, tagsData, collectionsData] = await Promise.all([
        bookmarkService.getAll(),
        tagService.getAll(),
        collectionService.getAll()
      ]);
      
      // Filter for recent bookmarks (last 7 days)
      const cutoffDate = subDays(new Date(), RECENT_DAYS);
      const recentBookmarks = allBookmarks.filter(bookmark =>
        isAfter(new Date(bookmark.createdAt), cutoffDate)
      );
      
      setBookmarks(recentBookmarks);
      setAvailableTags(tagsData);
      setCollections(collectionsData);
    } catch (err) {
      setError("Failed to load recent bookmarks. Please try again.");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.description.toLowerCase().includes(query) ||
        (bookmark.tags && bookmark.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      const tagNames = selectedTags.map(tag => tag.name);
      filtered = filtered.filter(bookmark =>
        bookmark.tags && bookmark.tags.some(tag => tagNames.includes(tag))
      );
    }

    // Sort (recent bookmarks are always sorted by creation date by default)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "url":
          return a.url.localeCompare(b.url);
        case "createdAt":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredBookmarks(filtered);
  };

  const handleSaveBookmark = async (bookmarkData) => {
    try {
      if (editingBookmark) {
        const updatedBookmark = await bookmarkService.update(editingBookmark.Id, bookmarkData);
        setBookmarks(prev => prev.map(b => b.Id === editingBookmark.Id ? updatedBookmark : b));
      } else {
        const newBookmark = await bookmarkService.create(bookmarkData);
        // Add to recent if it's actually recent
        const cutoffDate = subDays(new Date(), RECENT_DAYS);
        if (isAfter(new Date(newBookmark.createdAt), cutoffDate)) {
          setBookmarks(prev => [newBookmark, ...prev]);
        }
      }
      
      await refreshSidebarData();
    } catch (error) {
      console.error("Failed to save bookmark:", error);
      throw error;
    }
  };

  const handleDeleteBookmark = async (bookmark) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await bookmarkService.delete(bookmark.Id);
        setBookmarks(prev => prev.filter(b => b.Id !== bookmark.Id));
        toast.success("Bookmark deleted successfully!");
        await refreshSidebarData();
      } catch (error) {
        toast.error("Failed to delete bookmark.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(prev => prev.filter(tag => tag.Id !== tagToRemove.Id));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const hasFilters = searchQuery.trim() || selectedTags.length > 0;

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-blue-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery("")}
        onAddBookmark={() => setIsAddModalOpen(true)}
        onToggleMobileSidebar={onToggleMobileSidebar}
        title={`Recent Bookmarks (Last ${RECENT_DAYS} days)`}
      />

      <div className="p-6">
        <FilterBar
          totalCount={filteredBookmarks.length}
          selectedTags={selectedTags}
          onTagRemove={handleTagRemove}
          onClearFilters={handleClearFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          hasFilters={hasFilters}
        />

        {/* Bookmarks Grid/List */}
        {filteredBookmarks.length === 0 ? (
          <Empty
            title={hasFilters ? "No recent bookmarks found" : "No recent bookmarks"}
            description={hasFilters 
              ? "Try adjusting your filters or search terms to find what you're looking for."
              : `No bookmarks have been added in the last ${RECENT_DAYS} days. Add some new ones to see them here!`
            }
            onAction={hasFilters ? undefined : () => setIsAddModalOpen(true)}
            icon={hasFilters ? "Search" : "Clock"}
            actionText="Add Bookmark"
          />
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.Id}
                  bookmark={bookmark}
                  onEdit={(bookmark) => {
                    setEditingBookmark(bookmark);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Bookmark Modal */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBookmark(null);
        }}
        onSave={handleSaveBookmark}
        bookmark={editingBookmark}
        availableTags={availableTags}
        collections={collections}
      />
    </div>
  );
};

export default Recent;