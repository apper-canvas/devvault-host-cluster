import collectionsData from "@/services/mockData/collections.json";
import bookmarkService from "./bookmarkService";

class CollectionService {
  constructor() {
    this.collections = [...collectionsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Update bookmark counts dynamically
    const bookmarks = await bookmarkService.getAll();
    const collectionsWithCounts = this.collections.map(collection => {
      const bookmarkCount = bookmarks.filter(b => b.collectionId === collection.Id).length;
      return { ...collection, bookmarkCount };
    });
    
    return collectionsWithCounts;
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const collection = this.collections.find(c => c.Id === id);
    
    if (!collection) return null;
    
    // Update bookmark count dynamically
    const bookmarks = await bookmarkService.getAll();
    const bookmarkCount = bookmarks.filter(b => b.collectionId === id).length;
    
    return { ...collection, bookmarkCount };
  }

  async create(collectionData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const maxId = this.collections.length > 0 
      ? Math.max(...this.collections.map(c => c.Id))
      : 0;
    
    const newCollection = {
      Id: maxId + 1,
      ...collectionData,
      bookmarkCount: 0,
      createdAt: new Date().toISOString()
    };
    
    this.collections.push(newCollection);
    return { ...newCollection };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.collections.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Collection not found");
    }
    
    const updatedCollection = {
      ...this.collections[index],
      ...updateData,
      Id: id
    };
    
    this.collections[index] = updatedCollection;
    return { ...updatedCollection };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.collections.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Collection not found");
    }
    
    this.collections.splice(index, 1);
    return true;
  }
}

export default new CollectionService();