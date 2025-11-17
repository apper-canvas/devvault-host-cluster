import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Label from "@/components/atoms/Label";
import TagSelector from "@/components/molecules/TagSelector";
import ApperIcon from "@/components/ApperIcon";

const AddBookmarkModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  bookmark = null,
  availableTags = [],
  collections = []
}) => {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    tags: [],
    collectionId: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or bookmark changes
  useEffect(() => {
    if (isOpen) {
      if (bookmark) {
        // Edit mode
        setFormData({
          url: bookmark.url || "",
          title: bookmark.title || "",
          description: bookmark.description || "",
          tags: bookmark.tags ? bookmark.tags.map(tagName => ({ Id: Date.now() + Math.random(), name: tagName, category: "custom", usageCount: 0 })) : [],
          collectionId: bookmark.collectionId || ""
        });
      } else {
        // Add mode
        setFormData({
          url: "",
          title: "",
          description: "",
          tags: [],
          collectionId: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, bookmark]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUrlChange = async (url) => {
    setFormData({ ...formData, url });
    
    // Auto-parse metadata if URL is valid and title is empty
    if (url && !formData.title && !bookmark) {
      try {
        new URL(url);
        // Simulate metadata parsing
        const domain = new URL(url).hostname.replace("www.", "");
        const title = domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1);
        setFormData(prev => ({ 
          ...prev, 
          url,
          title: prev.title || title,
          description: prev.description || `Resource from ${domain}`
        }));
      } catch {
        // Invalid URL, just update the url field
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const bookmarkData = {
        ...formData,
        tags: formData.tags.map(tag => tag.name),
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(formData.url).hostname}&sz=32`
      };
      
      if (bookmark) {
        await onSave({ ...bookmark, ...bookmarkData });
        toast.success("Bookmark updated successfully!");
      } else {
        await onSave(bookmarkData);
        toast.success("Bookmark added successfully!");
      }
      
      onClose();
    } catch (error) {
      toast.error("Failed to save bookmark. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookmark ? "Edit Bookmark" : "Add New Bookmark"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Field */}
        <div className="space-y-2">
          <Label htmlFor="url">URL *</Label>
          <div className="relative">
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
              className={errors.url ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
            />
            <ApperIcon name="Link" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          {errors.url && (
            <p className="text-sm text-red-600 flex items-center">
              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
              {errors.url}
            </p>
          )}
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter bookmark title"
            className={errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-600 flex items-center">
              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this resource..."
            rows={3}
          />
        </div>

        {/* Tags Field */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagSelector
            selectedTags={formData.tags}
            availableTags={availableTags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="Add tags to categorize this bookmark..."
          />
          <p className="text-xs text-slate-500">
            Use tags like "docs", "tools", "tutorials", "references", or "repos" to organize your bookmarks
          </p>
        </div>

        {/* Collection Field */}
        <div className="space-y-2">
          <Label htmlFor="collection">Collection</Label>
          <select
            id="collection"
            value={formData.collectionId}
            onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          >
            <option value="">No collection</option>
            {collections.map((collection) => (
              <option key={collection.Id} value={collection.Id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name={bookmark ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                {bookmark ? "Update" : "Add"} Bookmark
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBookmarkModal;