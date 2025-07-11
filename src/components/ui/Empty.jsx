import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "Database", 
  title = "No data available", 
  description = "There's no data to display at the moment.",
  actionLabel = "Add Data",
  onAction,
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-center justify-center p-12", className)}
    >
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-primary-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-6">
          {description}
        </p>
        
        {onAction && (
          <Button
            onClick={onAction}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default Empty;