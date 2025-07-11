import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { formatDistance } from "date-fns";
import { cn } from "@/utils/cn";

const NotificationItem = ({ notification, onClick }) => {
  const getIcon = (type) => {
    switch (type) {
      case "user": return "User";
      case "system": return "Settings";
      case "alert": return "AlertTriangle";
      case "success": return "CheckCircle";
      default: return "Bell";
    }
  };

  const getVariant = (type) => {
    switch (type) {
      case "alert": return "warning";
      case "success": return "success";
      case "system": return "info";
      default: return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer",
        !notification.read && "border-primary-500/30 bg-primary-500/5"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <Avatar
          size="sm"
          fallback={<ApperIcon name={getIcon(notification.type)} size={16} />}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={getVariant(notification.type)} className="text-xs">
            {notification.type}
          </Badge>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary-500"></div>
          )}
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-2">
          {notification.message}
        </p>
        
        <p className="text-xs text-gray-500 mt-1">
          {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationItem;