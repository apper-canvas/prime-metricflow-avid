import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const UserMenu = ({ user, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Profile", icon: "User", path: "/settings" },
    { label: "Settings", icon: "Settings", path: "/settings" },
    { label: "Billing", icon: "CreditCard", path: "/billing" },
    { label: "Help", icon: "HelpCircle", path: "/help" },
  ];

  const handleItemClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2"
      >
        <Avatar
          size="sm"
          src={user?.avatar}
          fallback={user?.name?.charAt(0) || "U"}
        />
        <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
        <ApperIcon name="ChevronDown" size={14} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-20"
            >
              <div className="px-3 py-2 border-b border-white/10 mb-2">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
              
              <div className="border-t border-white/10 mt-2 pt-2">
                <button
                  onClick={() => {
                    // Handle logout
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="LogOut" size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;