import settingsData from '@/services/mockData/settings.json';

class SettingsService {
  constructor() {
    this.storageKey = 'app_preferences';
    this.defaultSettings = settingsData;
  }

  async getPreferences() {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Return default settings if none stored
      return { ...this.defaultSettings };
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw new Error('Failed to fetch user preferences');
    }
  }

  async updateTheme(themeName) {
    try {
      // Validate theme name
      const validThemes = ['light', 'dark', 'auto'];
      if (!validThemes.includes(themeName)) {
        throw new Error(`Invalid theme: ${themeName}`);
      }

      const current = await this.getPreferences();
      const updated = { ...current, theme: themeName };
      
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return updated;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw new Error('Failed to update theme preference');
    }
  }

  async updatePreferences(settings) {
    try {
      // Validate required fields
      if (!settings) {
        throw new Error('Settings object is required');
      }

      const current = await this.getPreferences();
      const updated = { ...current, ...settings };
      
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 150));
      
      return updated;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }

  async resetToDefaults() {
    try {
      localStorage.removeItem(this.storageKey);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { ...this.defaultSettings };
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw new Error('Failed to reset preferences');
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;