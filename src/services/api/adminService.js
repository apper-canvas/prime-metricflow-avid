import adminUsersData from "@/services/mockData/adminUsers.json";
import systemStatsData from "@/services/mockData/systemStats.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  async getUsers() {
    await delay(400);
    return [...adminUsersData];
  },

  async getSystemStats() {
    await delay(350);
    return { ...systemStatsData };
  },

  async updateUserStatus(id, status) {
    await delay(300);
    const index = adminUsersData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    
    adminUsersData[index] = { ...adminUsersData[index], status };
    return { ...adminUsersData[index] };
  },

  async deleteUser(id) {
    await delay(400);
    const index = adminUsersData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    
    adminUsersData.splice(index, 1);
    return { success: true };
  }
};