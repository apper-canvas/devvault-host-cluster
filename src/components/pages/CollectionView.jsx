import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import FilterBar from "@/components/molecules/FilterBar";
import BookmarkCard from "@/components/molecules/BookmarkCard";
import AddBookmarkModal from "@/components/organisms/AddBookmarkModal";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import bookmarkService from "@/services/api/bookmarkService";
import collectionService from "@/services/api/collectionService";
import tagService from "@/services/api/tagService";

const CollectionView = () => {
  const { id } = useParams();
  const { onToggleMobileSidebar, refreshSidebarData } = useOutletContext();
  
  const [collection, setCollection] = useState(null);
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

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, selectedTags, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [collectionData, allBookmarks, tagsData, collectionsData] = await Promise.all([
        collectionService.getById(parseInt(id)),
        bookmarkService.getAll(),
        tagService.getAll(),
        collectionService.getAll()
      ]);
      
      if (!collectionData) {
        setError("Collection not found");
        return;
      }
      
      setCollection(collectionData);
      
      // Filter bookmarks by collection
      const collectionBookmarks = allBookmarks.filter(bookmark => 
        bookmark.collectionId === parseInt(id)
      );
      setBookmarks(collectionBookmarks);
      
      setAvailableTags(tagsData);
      setCollections(collectionsData);
    } catch (err) {
      setError("Failed to load collection. Please try again.");
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

    // Sort
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
        const updatedBookmark = await bookmarkService.update(editingBookmark.Id, {
          ...bookmarkData,
          collectionId: parseInt(id) // Ensure bookmark stays in this collection
        });
        setBookmarks(prev => prev.map(b => b.Id === editingBookmark.Id ? updatedBookmark : b));
      } else {
        const newBookmark = await bookmarkService.create({
          ...bookmarkData,
          collectionId: parseInt(id) // Add to this collection
        });
        setBookmarks(prev => [newBookmark, ...prev]);
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
        title={collection?.name || "Collection"}
      />

      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <ApperIcon name="Home" className="w-4 h-4" />
          <span>Collections</span>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="font-medium text-slate-900">{collection?.name}</span>
        </div>

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
            title={hasFilters ? "No bookmarks found" : "Collection is empty"}
            description={hasFilters 
              ? "Try adjusting your filters or search terms to find what you're looking for."
              : `Add bookmarks to your "${collection?.name}" collection to get started.`
            }
            onAction={hasFilters ? undefined : () => setIsAddModalOpen(true)}
            icon={hasFilters ? "Search" : "FolderPlus"}
            actionText="Add to Collection"
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

export default CollectionView;