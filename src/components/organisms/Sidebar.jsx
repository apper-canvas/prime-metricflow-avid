import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      label: "Dashboard", 
      icon: "BarChart3", 
      path: "/",
      description: "Overview and key metrics"
    },
    { 
      label: "Analytics", 
      icon: "TrendingUp", 
      path: "/analytics",
      description: "Detailed data analysis"
    },
    { 
      label: "Team", 
      icon: "Users", 
      path: "/team",
      description: "Manage team members"
    },
    { 
      label: "Billing", 
      icon: "CreditCard", 
      path: "/billing",
      description: "Subscription and payments"
    },
    { 
      label: "Settings", 
      icon: "Settings", 
      path: "/settings",
      description: "App configuration"
    },
{ 
      label: "Admin", 
      icon: "Shield", 
      path: "/admin",
      description: "System administration"
    },
    { 
      label: "Onboarding", 
      icon: "UserPlus", 
      path: "/onboarding",
      description: "Setup wizard"
    },
  ];

  const isActive = (path) => {
    return path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "hidden lg:flex flex-col h-screen bg-dark-800/50 backdrop-blur-sm border-r border-white/10 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
              <ApperIcon name="BarChart3" size={20} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold gradient-text">MetricFlow</h1>
                <p className="text-xs text-gray-400">Analytics Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "sidebar-item group relative",
                  isActive && "active"
                )
              }
              title={collapsed ? item.label : ""}
            >
              <ApperIcon name={item.icon} size={20} />
              {!collapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300">
                    {item.description}
                  </div>
                </div>
              )}
              {isActive(item.path) && !collapsed && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 w-2 h-2 rounded-full bg-primary-500"
                />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ApperIcon 
              name={collapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-gray-400"
            />
            {!collapsed && <span className="text-sm text-gray-400">Collapse</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar implementation would go here */}
      </div>
    </>
  );
};

export default Sidebar;