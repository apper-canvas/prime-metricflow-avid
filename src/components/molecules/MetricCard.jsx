import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const MetricCard = ({ title, value, change, icon, trend, className, children }) => {
  const isPositive = change > 0;
  const changeColor = isPositive ? "text-green-400" : "text-red-400";
  const trendIcon = isPositive ? "TrendingUp" : "TrendingDown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("p-6 space-y-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/10">
              <ApperIcon name={icon} size={20} className="text-primary-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          </div>
          {trend && (
            <Badge variant={isPositive ? "success" : "danger"} className="flex items-center gap-1">
              <ApperIcon name={trendIcon} size={12} />
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold gradient-text">
            {value}
          </div>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", changeColor)}>
              <ApperIcon name={trendIcon} size={14} />
              <span>{Math.abs(change).toFixed(1)}% from last period</span>
            </div>
          )}
        </div>
        
        {children}
      </Card>
    </motion.div>
  );
};

export default MetricCard;