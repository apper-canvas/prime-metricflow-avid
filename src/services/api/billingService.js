import billingData from "@/services/mockData/billing.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const billingService = {
  async getBillingInfo() {
    await delay(400);
    return { ...billingData };
  },

  async changePlan(planId) {
    await delay(500);
    const plan = billingData.availablePlans.find(p => p.Id === parseInt(planId));
    if (!plan) throw new Error("Plan not found");
    
    billingData.currentPlan = { ...plan };
    return { ...billingData.currentPlan };
  },

  async updatePaymentMethod(paymentMethodData) {
    await delay(400);
    return { success: true };
  },

  async cancelSubscription() {
    await delay(500);
    billingData.currentPlan.status = "cancelled";
    return { success: true };
  }
};