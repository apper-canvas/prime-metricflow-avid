import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { onboardingService } from "@/services/api/onboardingService";
import subscriptionPlans from "@/services/mockData/subscriptionPlans.json";
import dashboardTemplates from "@/services/mockData/dashboardTemplates.json";
import { cn } from "@/utils/cn";

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Profile data
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    // Subscription data
    selectedPlan: "starter",
    // Dashboard data
    selectedTemplate: "business"
  });
  const [errors, setErrors] = useState({});

  const steps = [
    {
      id: 1,
      title: "Profile Setup",
      description: "Tell us about yourself",
      icon: "User"
    },
    {
      id: 2,
      title: "Choose Plan",
      description: "Select your subscription",
      icon: "CreditCard"
    },
    {
      id: 3,
      title: "Dashboard Setup",
      description: "Configure your workspace",
      icon: "LayoutDashboard"
    }
  ];

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await onboardingService.getProgress();
        if (progress) {
          setCurrentStep(progress.currentStep);
          setFormData(prev => ({ ...prev, ...progress.data }));
        }
      } catch (error) {
        console.error("Failed to load onboarding progress:", error);
      }
    };
    loadProgress();
  }, []);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.company.trim()) newErrors.company = "Company name is required";
      if (!formData.role.trim()) newErrors.role = "Role is required";
    }
    
    if (step === 2) {
      if (!formData.selectedPlan) newErrors.selectedPlan = "Please select a subscription plan";
    }
    
    if (step === 3) {
      if (!formData.selectedTemplate) newErrors.selectedTemplate = "Please select a dashboard template";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await onboardingService.updateProgress(currentStep, formData);
      
      if (currentStep === 3) {
        // Complete onboarding
        await onboardingService.completeOnboarding(formData);
        toast.success("Welcome to MetricFlow! Your account has been set up successfully.");
        navigate("/");
      } else {
        setCurrentStep(prev => prev + 1);
        toast.success("Progress saved! Continue to the next step.");
      }
    } catch (error) {
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderProgressBar = () => (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              currentStep >= step.id
                ? "bg-primary-500 border-primary-500 text-white"
                : "border-gray-300 text-gray-400 bg-white"
            )}>
              {currentStep > step.id ? (
                <ApperIcon name="Check" size={20} />
              ) : (
                <ApperIcon name={step.icon} size={20} />
              )}
            </div>
            {step.id < steps.length && (
              <div className={cn(
                "w-16 md:w-32 h-0.5 mx-2 transition-all duration-300",
                currentStep > step.id ? "bg-primary-500" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep - 1].title}</h2>
        <p className="text-gray-600 mt-1">{steps[currentStep - 1].description}</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
                placeholder="Enter your first name"
              />
              <FormField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
                placeholder="Enter your last name"
              />
            </div>
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter your email address"
            />
            <FormField
              label="Company Name"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              error={errors.company}
              placeholder="Enter your company name"
            />
            <FormField
              label="Your Role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              error={errors.role}
              placeholder="e.g., CEO, Marketing Manager, Data Analyst"
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Your Plan</h3>
              <p className="text-gray-600">Select the plan that best fits your needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "p-6 cursor-pointer transition-all duration-200 hover:shadow-lg",
                    formData.selectedPlan === plan.id
                      ? "ring-2 ring-primary-500 bg-primary-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleInputChange("selectedPlan", plan.id)}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Check" size={16} className="text-primary-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {formData.selectedPlan === plan.id && (
                    <div className="flex justify-center">
                      <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                        Selected
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            {errors.selectedPlan && (
              <p className="text-red-500 text-sm text-center">{errors.selectedPlan}</p>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Your Dashboard</h3>
              <p className="text-gray-600">Select a template to get started quickly</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "p-6 cursor-pointer transition-all duration-200 hover:shadow-lg",
                    formData.selectedTemplate === template.id
                      ? "ring-2 ring-primary-500 bg-primary-50"
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => handleInputChange("selectedTemplate", template.id)}
                >
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name={template.icon} size={24} className="text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Check" size={16} className="text-primary-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {formData.selectedTemplate === template.id && (
                    <div className="flex justify-center mt-4">
                      <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                        Selected
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            {errors.selectedTemplate && (
              <p className="text-red-500 text-sm text-center">{errors.selectedTemplate}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
              <ApperIcon name="BarChart3" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MetricFlow</h1>
          <p className="text-gray-600 text-lg">Let's set up your analytics platform in just a few steps</p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 mb-8">
              {renderStepContent()}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ChevronLeft" size={16} />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2"
            variant={currentStep === 3 ? "success" : "primary"}
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Saving...
              </>
            ) : currentStep === 3 ? (
              <>
                Complete Setup
                <ApperIcon name="Check" size={16} />
              </>
            ) : (
              <>
                Next
                <ApperIcon name="ChevronRight" size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;