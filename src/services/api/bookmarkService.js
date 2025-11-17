import bookmarksData from "@/services/mockData/bookmarks.json";

class BookmarkService {
  constructor() {
    this.bookmarks = [...bookmarksData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.bookmarks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const bookmark = this.bookmarks.find(b => b.Id === id);
    return bookmark ? { ...bookmark } : null;
  }

  async create(bookmarkData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.bookmarks.length > 0 
      ? Math.max(...this.bookmarks.map(b => b.Id))
      : 0;
    
    const newBookmark = {
      Id: maxId + 1,
      ...bookmarkData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.bookmarks.unshift(newBookmark);
    return { ...newBookmark };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.bookmarks.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Bookmark not found");
    }
    
    const updatedBookmark = {
      ...this.bookmarks[index],
      ...updateData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    this.bookmarks[index] = updatedBookmark;
    return { ...updatedBookmark };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.bookmarks.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Bookmark not found");
    }
    
    this.bookmarks.splice(index, 1);
    return true;
  }

  async getByCollection(collectionId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.bookmarks.filter(b => b.collectionId === collectionId);
  }

  async getByTag(tagName) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.bookmarks.filter(b => b.tags && b.tags.includes(tagName));
  }
}

export default new BookmarkService();