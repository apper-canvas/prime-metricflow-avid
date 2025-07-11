import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Avatar from "@/components/atoms/Avatar";
import { settingsService } from "@/services/api/settingsService";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    timezone: "UTC",
    avatar: null
  });
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    theme: "dark",
    language: "en"
  });
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "preferences", label: "Preferences", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "security", label: "Security", icon: "Shield" },
    { id: "integrations", label: "Integrations", icon: "Plug" },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setProfile(data.profile);
      setPreferences(data.preferences);
    } catch (err) {
      toast.error("Failed to load settings");
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await settingsService.updateProfile(profile);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      await settingsService.updatePreferences(preferences);
      toast.success("Preferences updated successfully!");
    } catch (err) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
            <form onSubmit={saveProfile} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar
                  src={profile.avatar}
                  fallback={profile.name?.charAt(0) || "U"}
                  size="xl"
                />
                <div>
                  <Button variant="outline" size="sm" className="mb-2">
                    Upload Photo
                  </Button>
                  <p className="text-sm text-gray-400">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
                
                <FormField
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
                
                <FormField
                  label="Company"
                  value={profile.company}
                  onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full h-10 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
              
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>
        );
      
      case "preferences":
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">
                  Theme
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full h-10 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full h-10 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <Button onClick={savePreferences} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </Card>
        );
      
      case "notifications":
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Notification Settings</h3>
            <div className="space-y-4">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <h4 className="font-medium text-white capitalize">{key} Notifications</h4>
                    <p className="text-sm text-gray-400">
                      Receive notifications via {key}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [key]: e.target.checked
                        }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
              
              <Button onClick={savePreferences} disabled={loading}>
                {loading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </div>
          </Card>
        );
      
      case "security":
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Security Settings</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">API Keys</h4>
                    <p className="text-sm text-gray-400">
                      Manage your API keys and access tokens
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Change Password</h4>
                    <p className="text-sm text-gray-400">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      
      case "integrations":
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Integrations</h3>
            <div className="space-y-4">
              {[
                { name: "Slack", icon: "MessageSquare", connected: true },
                { name: "Google Analytics", icon: "BarChart3", connected: false },
                { name: "Stripe", icon: "CreditCard", connected: true },
                { name: "Zapier", icon: "Zap", connected: false },
                { name: "GitHub", icon: "Github", connected: false },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                      <ApperIcon name={integration.icon} size={20} className="text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{integration.name}</h4>
                      <p className="text-sm text-gray-400">
                        {integration.connected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={integration.connected ? "danger" : "outline"}
                    size="sm"
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="p-4 lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border-l-4 border-primary-500"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;