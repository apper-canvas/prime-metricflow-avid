import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricGrid from "@/components/organisms/MetricGrid";
import ChartContainer from "@/components/organisms/ChartContainer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { metricsService } from "@/services/api/metricsService";
import { analyticsService } from "@/services/api/analyticsService";

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [metricsData, analyticsData] = await Promise.all([
        metricsService.getAll(),
        analyticsService.getDashboardCharts()
      ]);
      
      setMetrics(metricsData);
      setChartData(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />;
  }

  if (metrics.length === 0) {
    return (
      <Empty
        icon="BarChart3"
        title="No metrics available"
        description="Start by adding some metrics to see your dashboard come to life."
        actionLabel="Add Metrics"
        onAction={() => console.log("Add metrics")}
      />
    );
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
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
<div className="text-right">
          <p className="text-sm text-gray-600">Last updated</p>
          <p className="text-sm font-medium text-black">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricGrid metrics={metrics} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Revenue Trend"
          data={chartData.revenue}
          type="line"
        />
        <ChartContainer
          title="User Growth"
          data={chartData.users}
          type="bar"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer
          title="Traffic Sources"
          data={chartData.traffic}
          type="pie"
          className="lg:col-span-1"
        />
        <ChartContainer
          title="Conversion Funnel"
          data={chartData.conversion}
          type="bar"
          className="lg:col-span-2"
        />
      </div>
    </motion.div>
  );
};

export default Dashboard;