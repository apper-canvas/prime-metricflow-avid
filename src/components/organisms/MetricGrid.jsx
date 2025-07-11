import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import { cn } from "@/utils/cn";

const MetricGrid = ({ metrics, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <MetricCard
            title={metric.name}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            trend={true}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MetricGrid;