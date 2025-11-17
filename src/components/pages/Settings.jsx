import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import settingsService from '@/services/api/settingsService';

const Settings = () => {
  const { theme: currentTheme, applyTheme } = useOutletContext() || {};
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'light');
  const [loading, setLoading] = useState(false);
  const [autoStartOnBoot, setAutoStartOnBoot] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await settingsService.getPreferences();
      setSelectedTheme(prefs.theme || 'light');
      setAutoStartOnBoot(prefs.autoStartOnBoot || false);
      setCompactMode(prefs.compactMode || false);
    } catch (err) {
      console.error('Failed to load preferences:', err);
      toast.error('Failed to load preferences');
    }
  };

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    applyTheme?.(newTheme);
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await settingsService.updatePreferences({
        theme: selectedTheme,
        autoStartOnBoot,
        compactMode
      });
      toast.success('Preferences saved successfully');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your preferences and app configuration</p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Theme Section */}
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                  <ApperIcon name="Palette" className="w-5 h-5" />
                  <span>Theme</span>
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Choose how the app should look on your device
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Light Theme */}
              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleThemeChange('light')}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={selectedTheme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  className="w-4 h-4"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-slate-900">Light</p>
                  <p className="text-sm text-slate-600">Bright interface optimized for day use</p>
                </div>
                <div className="w-8 h-8 bg-white border border-slate-200 rounded ml-2"></div>
              </label>

              {/* Dark Theme */}
              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleThemeChange('dark')}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={selectedTheme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  className="w-4 h-4"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-slate-900">Dark</p>
                  <p className="text-sm text-slate-600">Dark interface optimized for night use</p>
                </div>
                <div className="w-8 h-8 bg-slate-900 border border-slate-700 rounded ml-2"></div>
              </label>

              {/* Auto Theme */}
              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleThemeChange('auto')}>
                <input
                  type="radio"
                  name="theme"
                  value="auto"
                  checked={selectedTheme === 'auto'}
                  onChange={() => handleThemeChange('auto')}
                  className="w-4 h-4"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-slate-900">Auto</p>
                  <p className="text-sm text-slate-600">Automatically switch based on device settings</p>
                </div>
                <ApperIcon name="Sun" className="w-4 h-4 mr-1 ml-2" />
                <ApperIcon name="Moon" className="w-4 h-4 ml-1" />
              </label>
            </div>
          </div>

          {/* App Configuration Section */}
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <ApperIcon name="Sliders" className="w-5 h-5" />
              <span>App Configuration</span>
            </h2>

            <div className="space-y-4">
              {/* Auto Start Option */}
              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={autoStartOnBoot}
                  onChange={(e) => setAutoStartOnBoot(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-slate-900">Auto-start on boot</p>
                  <p className="text-sm text-slate-600">Automatically launch the app when your device starts</p>
                </div>
              </label>

              {/* Compact Mode Option */}
              <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-slate-900">Compact mode</p>
                  <p className="text-sm text-slate-600">Display content in a more compact layout</p>
                </div>
              </label>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">App Information</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Version: 1.0.0</p>
              <p>Database: Connected to localStorage</p>
              <p>Last updated: Just now</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleSavePreferences}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Check" className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;