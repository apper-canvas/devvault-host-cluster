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
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import bookmarkService from "@/services/api/bookmarkService";
import tagService from "@/services/api/tagService";
import collectionService from "@/services/api/collectionService";

const TagView = () => {
  const { tagName } = useParams();
  const { onToggleMobileSidebar, refreshSidebarData } = useOutletContext();
  
  const [tag, setTag] = useState(null);
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

  const decodedTagName = decodeURIComponent(tagName);

  useEffect(() => {
    loadData();
  }, [tagName]);

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
      
      // Find the tag
      const currentTag = tagsData.find(t => t.name === decodedTagName);
      if (!currentTag) {
        setError("Tag not found");
        return;
      }
      
      setTag(currentTag);
      
      // Filter bookmarks by tag
      const taggedBookmarks = allBookmarks.filter(bookmark => 
        bookmark.tags && bookmark.tags.includes(decodedTagName)
      );
      setBookmarks(taggedBookmarks);
      
      setAvailableTags(tagsData);
      setCollections(collectionsData);
    } catch (err) {
      setError("Failed to load tagged bookmarks. Please try again.");
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

    // Additional tag filters (excluding the current tag)
    if (selectedTags.length > 0) {
      const additionalTagNames = selectedTags.map(tag => tag.name);
      filtered = filtered.filter(bookmark =>
        bookmark.tags && bookmark.tags.some(tag => additionalTagNames.includes(tag))
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
        const updatedBookmark = await bookmarkService.update(editingBookmark.Id, bookmarkData);
        setBookmarks(prev => prev.map(b => b.Id === editingBookmark.Id ? updatedBookmark : b));
      } else {
        // Pre-populate with current tag
        const newBookmark = await bookmarkService.create({
          ...bookmarkData,
          tags: [...new Set([decodedTagName, ...(bookmarkData.tags || [])])]
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
        title={`Tag: ${decodedTagName}`}
      />

      <div className="p-6">
        {/* Breadcrumb and Tag Info */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
            <ApperIcon name="Home" className="w-4 h-4" />
            <span>Tags</span>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <span className="font-medium text-slate-900">{decodedTagName}</span>
          </div>
          
          {tag && (
            <div className="flex items-center space-x-4 p-4 bg-surface rounded-lg border border-slate-200">
              <Badge variant={getCategoryVariant(tag.category)} className="text-lg px-3 py-1">
                {tag.name}
              </Badge>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <ApperIcon name="Bookmark" className="w-4 h-4 mr-1" />
                  <span>{tag.usageCount} bookmarks</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Tag" className="w-4 h-4 mr-1" />
                  <span>{tag.category}</span>
                </div>
              </div>
            </div>
          )}
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
            title={hasFilters ? "No bookmarks found" : "No bookmarks with this tag"}
            description={hasFilters 
              ? "Try adjusting your filters or search terms to find what you're looking for."
              : `Add bookmarks with the "${decodedTagName}" tag to see them here.`
            }
            onAction={hasFilters ? undefined : () => setIsAddModalOpen(true)}
            icon={hasFilters ? "Search" : "Tag"}
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

export default TagView;