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
  },

  async createUser(userData) {
    await delay(400);
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      throw new Error("Name, email, and role are required");
    }
    
    // Check for duplicate email
    const existingUser = adminUsersData.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Generate new ID
    const newId = Math.max(...adminUsersData.map(u => u.Id), 0) + 1;
    
    // Create new user object
    const newUser = {
      Id: newId,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: userData.role,
      status: "active",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    adminUsersData.push(newUser);
    return { ...newUser };
  }
};