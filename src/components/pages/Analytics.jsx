import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ChartContainer from "@/components/organisms/ChartContainer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { analyticsService } from "@/services/api/analyticsService";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("7d");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDetailedAnalytics(dateRange);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadAnalytics} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-gray-400 mt-1">
            Deep dive into your business performance and insights.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button className="flex items-center gap-2">
            <ApperIcon name="Download" size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analytics?.insights?.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                    <ApperIcon name={insight.icon} size={20} className="text-primary-400" />
                  </div>
<div>
                    <h3 className="font-semibold text-black">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
                <Badge variant={insight.trend === "up" ? "success" : "danger"}>
                  {insight.value}
                </Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Revenue vs Costs"
          data={analytics?.revenueVsCosts}
          type="line"
        />
        <ChartContainer
          title="User Acquisition"
          data={analytics?.userAcquisition}
          type="bar"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Geographic Distribution"
          data={analytics?.geographic}
          type="pie"
        />
        <ChartContainer
          title="Device Usage"
          data={analytics?.devices}
          type="bar"
        />
      </div>

      {/* Performance Metrics Table */}
      <Card className="p-6">
<div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Performance Metrics</h3>
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} />
            Filter
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
<tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Metric</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Current</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Previous</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Change</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Target</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.performanceMetrics?.map((metric, index) => (
<tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4 text-black font-medium">{metric.name}</td>
                  <td className="py-3 px-4 text-black">{metric.current}</td>
                  <td className="py-3 px-4 text-gray-600">{metric.previous}</td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center gap-1 ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <ApperIcon name={metric.change > 0 ? "TrendingUp" : "TrendingDown"} size={14} />
                      {Math.abs(metric.change)}%
                    </div>
</td>
                  <td className="py-3 px-4 text-gray-600">{metric.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default Analytics;