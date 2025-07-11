import dashboardChartsData from "@/services/mockData/dashboardCharts.json";
import detailedAnalyticsData from "@/services/mockData/detailedAnalytics.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getDashboardCharts() {
    await delay(400);
    return { ...dashboardChartsData };
  },

  async getDetailedAnalytics(dateRange = "7d") {
    await delay(500);
    return { ...detailedAnalyticsData };
  },

  async getReportData(reportType, filters = {}) {
    await delay(600);
    return {
      reportType,
      filters,
      data: [],
      generatedAt: new Date().toISOString()
    };
  }
};