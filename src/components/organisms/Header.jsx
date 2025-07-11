import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import UserMenu from "@/components/molecules/UserMenu";
import NotificationItem from "@/components/molecules/NotificationItem";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const Header = ({ className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      Id: 1,
      type: "system",
      message: "System maintenance scheduled for tomorrow at 2:00 AM",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      Id: 2,
      type: "user",
      message: "New team member John Doe has joined your workspace",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      Id: 3,
      type: "success",
      message: "Monthly report has been generated successfully",
      read: true,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ]);

  const currentUser = {
    name: "Alex Johnson",
    email: "alex@metricflow.com",
    avatar: null,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.Id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card border-b border-white/10 p-4 lg:p-6",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Search */}
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search metrics, users, or settings..."
            onSearch={handleSearch}
          />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" size={20} />
              {unreadCount > 0 && (
                <Badge
                  variant="danger"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-card p-4 z-20 max-h-96 overflow-y-auto"
                  >
<div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-black">Notifications</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        }}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.Id}
                          notification={notification}
                          onClick={() => handleNotificationClick(notification.Id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <UserMenu user={currentUser} />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;