import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Error = ({ error, onRetry, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-center justify-center p-12", className)}
    >
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-red-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-400 mb-6">
          {error || "An unexpected error occurred. Please try again."}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;