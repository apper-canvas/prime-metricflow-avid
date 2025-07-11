import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass-card p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-24"></div>
                  <div className="h-2 bg-white/10 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-white/10 rounded w-20"></div>
                <div className="h-3 bg-white/10 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="glass-card p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 bg-white/10 rounded w-32"></div>
                <div className="h-8 bg-white/10 rounded w-20"></div>
              </div>
              <div className="h-80 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-12", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full mx-auto"
        />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Loading...</h3>
          <p className="text-sm text-gray-400">Fetching your data</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;