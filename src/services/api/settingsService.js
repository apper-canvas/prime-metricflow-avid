import settingsData from "@/services/mockData/settings.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings() {
    await delay(300);
    return { ...settingsData };
  },

  async updateProfile(profileData) {
    await delay(400);
    settingsData.profile = { ...settingsData.profile, ...profileData };
    return { ...settingsData.profile };
  },

  async updatePreferences(preferencesData) {
    await delay(350);
    settingsData.preferences = { ...settingsData.preferences, ...preferencesData };
    return { ...settingsData.preferences };
  },

  async updateNotifications(notificationSettings) {
    await delay(300);
    settingsData.preferences.notifications = { ...settingsData.preferences.notifications, ...notificationSettings };
    return { ...settingsData.preferences.notifications };
  }
};