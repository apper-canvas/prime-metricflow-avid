import mockData from "@/services/mockData/metrics.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metricsService = {
  async getAll() {
    await delay(300);
    return [...mockData];
  },

  async getById(id) {
    await delay(200);
    const metric = mockData.find(m => m.Id === parseInt(id));
    if (!metric) throw new Error("Metric not found");
    return { ...metric };
  },

  async create(data) {
    await delay(400);
    const newMetric = {
      ...data,
      Id: Math.max(...mockData.map(m => m.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    mockData.push(newMetric);
    return { ...newMetric };
  },

  async update(id, data) {
    await delay(300);
    const index = mockData.findIndex(m => m.Id === parseInt(id));
    if (index === -1) throw new Error("Metric not found");
    
    mockData[index] = { ...mockData[index], ...data };
    return { ...mockData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = mockData.findIndex(m => m.Id === parseInt(id));
    if (index === -1) throw new Error("Metric not found");
    
    mockData.splice(index, 1);
    return { success: true };
  }
};