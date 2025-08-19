import api from "./axiosInstance";

// Interface for portfolio overview response based on actual API response
export interface PortfolioOverviewResponse {
  message: string;
  investor_name: string;
  invested_amount: number;
  success: boolean;
}

// Portfolio overview API service
export const portfolioService = {
  /**
   * Fetch portfolio overview data
   */
  async getPortfolioOverview(): Promise<PortfolioOverviewResponse | null> {
    try {
      const response = await api.get<PortfolioOverviewResponse>("/portfolio/overview");
      
      if (response.data.success) {
        console.log("Portfolio overview fetched successfully:", response.data);
        
        // Update localStorage with latest data
        if (response.data.investor_name) {
          localStorage.setItem("name", response.data.investor_name);
        }
        if (response.data.invested_amount !== undefined) {
          localStorage.setItem("investmentAmount", response.data.invested_amount.toString());
        }
        
        return response.data;
      } else {
        console.warn("Portfolio overview API returned success: false", response.data);
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching portfolio overview:", error);
      
      // Silent failure for background API calls
      if (error.response?.status === 401) {
        console.warn("Portfolio overview: Authentication error - user may need to login again");
      } else if (error.response?.status === 404) {
        console.warn("Portfolio overview: API endpoint not found");
      } else {
        console.warn("Portfolio overview: Network or server error");
      }
      
      return null;
    }
  },

  /**
   * Call portfolio overview and update app state silently
   * Used after transactions, onboarding completion, etc.
   */
  async updatePortfolioData(): Promise<void> {
    await this.getPortfolioOverview();
  }
};

export default portfolioService;