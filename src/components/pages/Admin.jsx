import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { adminService } from "@/services/api/adminService";
import { formatDistance } from "date-fns";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <h3 className="text-lg font-semibold text-white">User Management</h3>
                <Button className="flex items-center gap-2">
                  <ApperIcon name="UserPlus" size={16} />
                  Add User
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
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
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
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
                        <td className="py-3 px-4 text-gray-400">
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
                    <h3 className="text-2xl font-bold text-white">{systemStats.totalUsers}</h3>
                    <p className="text-sm text-gray-400">Total Users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-secondary-500/20 to-accent-500/20">
                    <ApperIcon name="TrendingUp" size={20} className="text-secondary-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{systemStats.activeUsers}</h3>
                    <p className="text-sm text-gray-400">Active Users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500/20 to-primary-500/20">
                    <ApperIcon name="DollarSign" size={20} className="text-accent-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">${systemStats.revenue}</h3>
                    <p className="text-sm text-gray-400">Revenue</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <ApperIcon name="Activity" size={20} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{systemStats.uptime}%</h3>
                    <p className="text-sm text-gray-400">System Uptime</p>
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
              <h3 className="text-lg font-semibold text-white mb-6">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <h4 className="font-medium text-white">Maintenance Mode</h4>
                    <p className="text-sm text-gray-400">
                      Enable maintenance mode to prevent user access
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <h4 className="font-medium text-white">Backup System</h4>
                    <p className="text-sm text-gray-400">
                      Configure automatic backups
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div>
                    <h4 className="font-medium text-white">Email Templates</h4>
                    <p className="text-sm text-gray-400">
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
              <h3 className="text-lg font-semibold text-white mb-6">Activity Logs</h3>
              <div className="space-y-4">
                {systemStats.activityLogs?.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                      <ApperIcon name="Activity" size={16} className="text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{log.action}</p>
                      <p className="text-sm text-gray-400">
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

        {/* Admin Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;