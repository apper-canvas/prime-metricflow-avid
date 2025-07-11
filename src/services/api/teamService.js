import mockData from "@/services/mockData/team.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const teamService = {
  async getMembers() {
    await delay(300);
    return [...mockData];
  },

  async inviteMember(inviteData) {
    await delay(500);
    const newMember = {
      Id: Math.max(...mockData.map(m => m.Id)) + 1,
      name: "New Member",
      email: inviteData.email,
      role: inviteData.role,
      status: "invited",
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      avatar: null
    };
    mockData.push(newMember);
    return { ...newMember };
  },

  async removeMember(id) {
    await delay(300);
    const index = mockData.findIndex(m => m.Id === parseInt(id));
    if (index === -1) throw new Error("Member not found");
    
    mockData.splice(index, 1);
    return { success: true };
  },

  async updateMemberRole(id, role) {
    await delay(250);
    const index = mockData.findIndex(m => m.Id === parseInt(id));
    if (index === -1) throw new Error("Member not found");
    
    mockData[index] = { ...mockData[index], role };
    return { ...mockData[index] };
  }
};