import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { billingService } from "@/services/api/billingService";
import { formatDistance } from "date-fns";

const Billing = () => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBilling();
  }, []);

  const loadBilling = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await billingService.getBillingInfo();
      setBilling(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId) => {
    try {
      await billingService.changePlan(planId);
      toast.success("Plan changed successfully!");
      loadBilling();
    } catch (err) {
      toast.error("Failed to change plan");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} onRetry={loadBilling} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Billing & Subscription</h1>
        <p className="text-gray-400 mt-1">
          Manage your subscription, billing information, and payment methods.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6">
<div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Current Plan</h3>
          <Badge variant="primary" className="text-sm">
            {billing?.currentPlan?.name}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              ${billing?.currentPlan?.price}
            </div>
            <p className="text-sm text-gray-400">per month</p>
          </div>
          
<div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">
              {billing?.usage?.current}
</div>
            <p className="text-sm text-gray-600">
              of {billing?.usage?.limit} users
            </p>
          </div>
          
<div className="text-center">
            <div className="text-3xl font-bold text-black mb-2">
              {billing?.nextBilling ? formatDistance(new Date(billing.nextBilling), new Date()) : "N/A"}
            </div>
            <p className="text-sm text-gray-600">until next billing</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
<div>
              <h4 className="font-medium text-black">Plan Features</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                {billing?.currentPlan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <ApperIcon name="Check" size={14} className="text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <Button variant="outline" className="mb-2">
                Change Plan
              </Button>
              <br />
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Plans */}
<h3 className="text-lg font-semibold text-black">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {billing?.availablePlans?.map((plan) => (
            <Card key={plan.Id} className="p-6 text-center">
<div className="mb-4">
                <h4 className="text-xl font-bold text-black mb-2">{plan.name}</h4>
                <div className="text-3xl font-bold gradient-text mb-2">
                  ${plan.price}
                </div>
                <p className="text-sm text-gray-600">per month</p>
              </div>
              
              <ul className="space-y-2 mb-6">
{plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Check" size={14} className="text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handlePlanChange(plan.Id)}
                disabled={plan.Id === billing?.currentPlan?.Id}
                className="w-full"
                variant={plan.Id === billing?.currentPlan?.Id ? "ghost" : "primary"}
              >
                {plan.Id === billing?.currentPlan?.Id ? "Current Plan" : "Select Plan"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card className="p-6">
<div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Payment Methods</h3>
          <Button variant="outline" className="flex items-center gap-2">
            <ApperIcon name="CreditCard" size={16} />
            Add Payment Method
          </Button>
        </div>
        
        <div className="space-y-4">
          {billing?.paymentMethods?.map((method, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                  <ApperIcon name="CreditCard" size={20} className="text-primary-400" />
                </div>
<div>
                  <h4 className="font-medium text-black">
                    •••• •••• •••• {method.last4}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {method.brand} • Expires {method.expiry}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {method.default && (
                  <Badge variant="primary" className="text-xs">Default</Badge>
                )}
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Billing History */}
<Card className="p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Billing History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
<tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billing?.billingHistory?.map((invoice, index) => (
<tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-black">{invoice.description}</td>
                  <td className="py-3 px-4 text-black">${invoice.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={invoice.status === "paid" ? "success" : "danger"}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Download" size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default Billing;