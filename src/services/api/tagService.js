import tagsData from "@/services/mockData/tags.json";
import bookmarkService from "./bookmarkService";

class TagService {
  constructor() {
    this.tags = [...tagsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Update usage counts dynamically
    const bookmarks = await bookmarkService.getAll();
    const tagsWithCounts = this.tags.map(tag => {
      const usageCount = bookmarks.filter(b => 
        b.tags && b.tags.includes(tag.name)
      ).length;
      return { ...tag, usageCount };
    });
    
    // Sort by usage count (most used first)
    return tagsWithCounts.sort((a, b) => b.usageCount - a.usageCount);
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const tag = this.tags.find(t => t.Id === id);
    
    if (!tag) return null;
    
    // Update usage count dynamically
    const bookmarks = await bookmarkService.getAll();
    const usageCount = bookmarks.filter(b => 
      b.tags && b.tags.includes(tag.name)
    ).length;
    
    return { ...tag, usageCount };
  }

  async getByName(name) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const tag = this.tags.find(t => t.name === name);
    
    if (!tag) return null;
    
    // Update usage count dynamically
    const bookmarks = await bookmarkService.getAll();
    const usageCount = bookmarks.filter(b => 
      b.tags && b.tags.includes(name)
    ).length;
    
    return { ...tag, usageCount };
  }

  async create(tagData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const maxId = this.tags.length > 0 
      ? Math.max(...this.tags.map(t => t.Id))
      : 0;
    
    const newTag = {
      Id: maxId + 1,
      ...tagData,
      usageCount: 0
    };
    
    this.tags.push(newTag);
    return { ...newTag };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.tags.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Tag not found");
    }
    
    const updatedTag = {
      ...this.tags[index],
      ...updateData,
      Id: id
    };
    
    this.tags[index] = updatedTag;
    return { ...updatedTag };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.tags.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Tag not found");
    }
    
    this.tags.splice(index, 1);
    return true;
  }
}

export default new TagService();