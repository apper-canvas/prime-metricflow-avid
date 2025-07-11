import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatDistance } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Settings from "@/components/pages/Settings";
import { adminService } from "@/services/api/adminService";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const tabs = [
    { id: "users", label: "Users", icon: "Users" },
    { id: "analytics", label: "Analytics", icon: "BarChart3" },
    { id: "settings", label: "System", icon: "Settings" },
    { id: "logs", label: "Activity Logs", icon: "FileText" },
  ];

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, statsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getSystemStats()
      ]);
      setUsers(usersData);
      setSystemStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleUserAction = async (userId, action) => {
    try {
      await adminService.updateUserStatus(userId, action);
      toast.success(`User ${action} successfully`);
      loadAdminData();
    } catch (err) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setCreateUserLoading(true);
      await adminService.createUser(userData);
      toast.success("User created successfully");
      setShowAddUserModal(false);
      loadAdminData();
    } catch (err) {
      toast.error("Failed to create user");
    } finally {
      setCreateUserLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} onRetry={loadAdminData} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="space-y-6">
<Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black">User Management</h3>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <ApperIcon name="UserPlus" size={16} />
                  Add User
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
<tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.Id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.avatar}
                              fallback={user.name.charAt(0)}
                              size="sm"
                            />
<div>
                              <div className="font-medium text-black">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.role === "admin" ? "primary" : "secondary"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.status === "active" ? "success" : "danger"}>
                            {user.status}
                          </Badge>
</td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDistance(new Date(user.lastActive), new Date(), { addSuffix: true })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(user.Id, user.status === "active" ? "suspend" : "activate")}
                            >
                              <ApperIcon name={user.status === "active" ? "UserX" : "UserCheck"} size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleUserAction(user.Id, "delete")}
                            >
                              <ApperIcon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
</div>
            </Card>

            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-black">Add New User</h3>
                      <button 
                        onClick={() => setShowAddUserModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ApperIcon name="X" size={20} />
                      </button>
                    </div>
                    
                    <AddUserForm 
                      onSubmit={handleCreateUser}
                      onCancel={() => setShowAddUserModal(false)}
                      loading={createUserLoading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                    <ApperIcon name="Users" size={20} className="text-primary-400" />
                  </div>
<div>
                    <h3 className="text-2xl font-bold text-black">{systemStats.totalUsers}</h3>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-secondary-500/20 to-accent-500/20">
                    <ApperIcon name="TrendingUp" size={20} className="text-secondary-400" />
                  </div>
<div>
                    <h3 className="text-2xl font-bold text-black">{systemStats.activeUsers}</h3>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500/20 to-primary-500/20">
                    <ApperIcon name="DollarSign" size={20} className="text-accent-400" />
                  </div>
<div>
                    <h3 className="text-2xl font-bold text-black">${systemStats.revenue}</h3>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <ApperIcon name="Activity" size={20} className="text-green-400" />
                  </div>
<div>
                    <h3 className="text-2xl font-bold text-black">{systemStats.uptime}%</h3>
                    <p className="text-sm text-gray-600">System Uptime</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      
      case "settings":
        return (
          <div className="space-y-6">
<Card className="p-6">
              <h3 className="text-lg font-semibold text-black mb-6">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
<div>
                    <h4 className="font-medium text-black">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">
                      Enable maintenance mode to prevent user access
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
<div>
                    <h4 className="font-medium text-black">Backup System</h4>
                    <p className="text-sm text-gray-600">
                      Configure automatic backups
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
<div>
                    <h4 className="font-medium text-black">Email Templates</h4>
                    <p className="text-sm text-gray-600">
                      Customize system email templates
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case "logs":
        return (
          <div className="space-y-6">
<Card className="p-6">
              <h3 className="text-lg font-semibold text-black mb-6">Activity Logs</h3>
              <div className="space-y-4">
                {systemStats.activityLogs?.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                      <ApperIcon name="Activity" size={16} className="text-primary-400" />
                    </div>
<div className="flex-1">
                      <p className="text-black">{log.action}</p>
                      <p className="text-sm text-gray-600">
                        {log.user} • {formatDistance(new Date(log.timestamp), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
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
        <h1 className="text-3xl font-bold gradient-text">Admin Portal</h1>
        <p className="text-gray-400 mt-1">
          Manage users, monitor system performance, and configure settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Admin Navigation */}
        <Card className="p-4 lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
<button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-black border-l-4 border-primary-500"
                    : "text-gray-800 hover:text-black hover:bg-white/10"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Admin Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
</div>
    </motion.div>
  );
};

// Add User Form Component
const AddUserForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter user name"
          disabled={loading}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter email address"
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ApperIcon name="UserPlus" size={16} />
              Create User
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default Admin;