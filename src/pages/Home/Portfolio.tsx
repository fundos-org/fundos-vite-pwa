import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "@/data/dummyInvestments";
import api from "@/lib/axiosInstance";

// Define interfaces for API response
interface Deal {
  company_name: string;
  about_company: string;
  industry: string;
  company_stage: string;
  logo_url: string;
  status: string;
  created_at: string;
  deal_capital_commitment: number;
  investment_status: string; // New field for investment status
  equity: number;
  committed_amount: number; // New field for committed amount
  id?: number; // Adding id for navigation purposes
  bgColor?: string; // Optional for custom background color
  textColor?: string; // Optional for custom text color
}

interface Pagination {
  page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface InvestmentsResponse {
  investor_id: string;
  deals: Deal[];
  pagination: Pagination;
  success: boolean;
}

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [investments, setInvestments] = useState<Deal[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalInvestment, setTotalInvestment] = useState<string>("0");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastInvestmentElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchInvestments = async (page: number = 1, perPage: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await api.get<InvestmentsResponse>(
        "/subadmin/investors/investments_info",
        {
          params: {
            page,
            per_page: perPage,
            investor_id: userId,
          },
        }
      );

      if (response.data.success) {
        // Filter deals to show only completed investments
        const completedDeals = response.data.deals.filter(
          (deal) => deal.investment_status === "COMPLETED"
        );

        const newDeals = completedDeals.map((deal, index) => ({
          ...deal,
          id: investments.length + index + 1, // Ensure unique IDs across pages
        }));

        if (page === 1) {
          setInvestments(newDeals);
        } else {
          setInvestments((prevInvestments) => [...prevInvestments, ...newDeals]);
        }
        
        // Update pagination to reflect filtered results
        const updatedPagination = {
          ...response.data.pagination,
          total_records: completedDeals.length
        };
        setPagination(updatedPagination);
        setHasMore(response.data.pagination.has_next);

        // Calculate total investment amount for completed investments only
        if (page === 1) {
          const totalAmount = completedDeals.reduce(
            (sum, deal) => sum + deal.deal_capital_commitment,
            0
          );
          
          // Format total investment
          setTotalInvestment(
            totalAmount >= 10000000
              ? `${(totalAmount / 10000000).toFixed(2)}Cr`
              : `${(totalAmount / 100000).toFixed(2)}L`
          );
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch investments");
      console.error("Error fetching investments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments(currentPage);
  }, [currentPage]);

  const handleInvestmentClick = (investmentId: number) => {
    navigate(`${investmentId}`);
  };

  // Helper function to format currency in Indian format
  const formatIndianCurrency = (amount: number): string => {
    if (amount === 0) return "₹0";

    // Convert to crores
    const inCrores = amount / 10000000;
    if (inCrores >= 1) {
      // For amounts ≥ 1 crore, show up to 1 decimal place
      return `₹${inCrores.toFixed(inCrores < 10 ? 1 : 0)}Cr`;
    }

    // Convert to lakhs
    const inLakhs = amount / 100000;
    if (inLakhs >= 1) {
      // For amounts ≥ 1 lakh, show up to 1 decimal place
      return `₹${inLakhs.toFixed(inLakhs < 10 ? 1 : 0)}L`;
    }

    // For smaller amounts, show in thousands
    const inThousands = amount / 1000;
    if (inThousands >= 1) {
      return `₹${inThousands.toFixed(1)}K`;
    }

    // For very small amounts
    return `₹${amount.toFixed(0)}`;
  };

  return (
    <div className="flex flex-col text-white overflow-hidden m-0 p-0 box-border mb-24">
      <div className="flex-1 px-6 py-4 overflow-auto">
        <h1 className="text-white text-3xl font-bold mb-6 text-left">
          Portfolio
        </h1>

        <div className="bg-[#242424] p-6 rounded-xs mb-3 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#62b3ff] via-[#ff8c9f] to-[#FE0166]"></div>
          <p className="text-gray-400 text-center mb-2">Your investments</p>
          <h2 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#62b3ff] via-[#ff8c9f] to-[#FE0166]">
            ₹{totalInvestment}
          </h2>
          <p className="text-sm text-center text-gray-400">
            You have completed investments in {pagination?.total_records || 0} deals
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button className="px-5 py-2.5 bg-black/30 rounded-full text-sm inline-flex items-center hover:bg-black/40 transition-colors">
            <img src="/portfolio.svg" alt="portfolio" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {investments.length === 0 && !isLoading ? (
            <div className="bg-[#242424] p-6 rounded-xs text-center">
              <p className="text-gray-400">No completed investments found</p>
            </div>
          ) : (
            investments.map((investment, index) => {
              const isLastElement = investments.length === index + 1;
              return (
                <div
                  key={investment.id}
                  ref={isLastElement ? lastInvestmentElementRef : null}
                  onClick={() => handleInvestmentClick(investment.id!)}
                  className="bg-[#242424] p-4 rounded-xs flex flex-col border border-white/10 cursor-pointer"
                >
                  <div className="flex items-start mb-3">
                    <div
                      className={`w-12 h-12 flex flex-col items-center justify-center ${investment.bgColor || 'bg-blue-500/20'} rounded-xs mr-3 flex-shrink-0`}
                    >
                      <span className={`${investment.textColor || 'text-blue-400'} font-bold`}>
                        {getInitials(investment.company_name)}
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-medium truncate">{investment.company_name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-block text-xs px-2 py-0.5 bg-gray-700 rounded-xs">
                          {investment.industry}
                        </span>
                        <span className="inline-block text-xs px-2 py-0.5 bg-gray-700 rounded-xs">
                          {investment.company_stage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-2"></div>

                  <div className="flex justify-between items-center pt-1 text-sm">
                    <p className="text-xs text-gray-400">
                      Committed Amount
                    </p>
                    <p className="font-medium text-right text-green-400">
                      {formatIndianCurrency(investment.committed_amount)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 p-4 rounded-xs text-center mt-4">
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => fetchInvestments(currentPage)}
              className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-xs text-sm"
            >
              Try Again
            </button>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
