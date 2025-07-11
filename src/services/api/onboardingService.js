const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'metricflow_onboarding';

class OnboardingService {
  // Get current onboarding progress
  async getProgress() {
    await delay(200);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load onboarding progress:', error);
      return null;
    }
  }

  // Update progress for current step
  async updateProgress(currentStep, data) {
    await delay(300);
    try {
      const progress = {
        currentStep,
        data: { ...data },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return progress;
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
      throw new Error('Failed to save progress');
    }
  }

  // Complete onboarding process
  async completeOnboarding(data) {
    await delay(500);
    try {
      // Save final user data
      const userData = {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          company: data.company,
          role: data.role
        },
        subscription: {
          plan: data.selectedPlan,
          startDate: new Date().toISOString()
        },
        dashboard: {
          template: data.selectedTemplate,
          configured: true
        },
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('metricflow_user', JSON.stringify(userData));
      
      // Clear onboarding progress
      localStorage.removeItem(STORAGE_KEY);
      
      return userData;
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      throw new Error('Failed to complete onboarding');
    }
  }

  // Check if user has completed onboarding
  async isOnboardingComplete() {
    await delay(100);
    try {
      const userData = localStorage.getItem('metricflow_user');
      if (!userData) return false;
      
      const user = JSON.parse(userData);
      return user.onboardingCompleted === true;
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return false;
    }
  }

  // Get user data after onboarding
  async getUserData() {
    await delay(200);
    try {
      const userData = localStorage.getItem('metricflow_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }

  // Reset onboarding (for testing/development)
  async resetOnboarding() {
    await delay(200);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('metricflow_user');
      return true;
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
      throw new Error('Failed to reset onboarding');
    }
  }

  // Get available subscription plans
  async getSubscriptionPlans() {
    await delay(300);
    return [
      {
        id: 'starter',
        name: 'Starter',
        price: 29,
        period: 'month',
        features: [
          'Up to 5 team members',
          'Basic analytics',
          'Email support',
          '5GB storage'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 79,
        period: 'month',
        features: [
          'Up to 25 team members',
          'Advanced analytics',
          'Priority support',
          '50GB storage',
          'Custom integrations'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199,
        period: 'month',
        features: [
          'Unlimited team members',
          'Full analytics suite',
          '24/7 phone support',
          'Unlimited storage',
          'Custom integrations',
          'Dedicated account manager'
        ]
      }
    ];
  }

  // Get available dashboard templates
  async getDashboardTemplates() {
    await delay(300);
    return [
      {
        id: 'business',
        name: 'Business Overview',
        description: 'Perfect for general business metrics',
        icon: 'BarChart3',
        features: [
          'Revenue tracking',
          'Customer metrics',
          'Sales performance',
          'Growth indicators'
        ]
      },
      {
        id: 'marketing',
        name: 'Marketing Focus',
        description: 'Optimized for marketing teams',
        icon: 'Target',
        features: [
          'Campaign performance',
          'Lead generation',
          'Conversion rates',
          'ROI analysis'
        ]
      },
      {
        id: 'analytics',
        name: 'Data Analytics',
        description: 'Advanced analytics for data teams',
        icon: 'TrendingUp',
        features: [
          'Deep data insights',
          'Custom metrics',
          'Predictive analytics',
          'Data visualization'
        ]
      }
    ];
  }
}

export const onboardingService = new OnboardingService();