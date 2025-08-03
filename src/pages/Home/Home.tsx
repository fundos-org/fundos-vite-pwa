import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RiFileChartLine } from "react-icons/ri";

interface Deal {
  deal_id: string;
  description: string;
  title: string;
  current_valuation: number;
  round_size: number;
  commitment: number;
  logo_url: string;
  minimum_investment: number;
  deal_status: "open" | "closed" | "on_hold";
  created_at: string;
  business_model: string;
  company_stage: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notInterestedDeals, setNotInterestedDeals] = useState<Deal[]>([]);
  const [showDeals, setShowDeals] = useState<Deal[]>([]);
  const [tabChange, setTabChange] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { localContextState, setLocalContextState } = useHomeContext();

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

  // Helper function to get initials from company name
  const getInitials = (name: string): string => {
    if (!name) return "?";
    return name
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Helper function to generate a pastel color based on string
  const getPastelColor = (str: string): { background: string, text: string } => {
    if (!str) return { background: "#e7dff8", text: "#6138b9" };
    
    // Generate a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate pastel color based on hash
    const h = Math.abs(hash) % 360;
    const s = 60 + Math.abs(hash) % 20; // Higher saturation for pastel
    const l = 80 + Math.abs(hash) % 10; // Higher lightness for pastel
    
    // Calculate contrasting text color (dark for light backgrounds)
    const textColor = l > 70 ? `hsl(${h}, ${Math.min(100, s + 20)}%, 25%)` : 
                              `hsl(${h}, ${Math.min(100, s + 10)}%, 95%)`;
    
    return {
      background: `hsl(${h}, ${s}%, ${l}%)`,
      text: textColor
    };
  };

  useEffect(() => {
    if (hasLoaded || !localContextState.userId) return; // <-- Only run if userId exists

    const fetchDeals = async () => {
      api
        .get("/deal/user-deals", {
          params: { user_id: localContextState.userId },
        })
        .then((response) => {
          const data = response.data;

          // Initialize arrays to accumulate deals
          let allInterestedDeals: Deal[] = [];
          let allNotInterestedDeals: Deal[] = [];

          // Check if subadmins is an array and process each item
          if (Array.isArray(data?.subadmins)) {
            data.subadmins.forEach((subadmin: any) => {
              if (Array.isArray(subadmin.interested_deals_data)) {
                allInterestedDeals = [
                  ...allInterestedDeals,
                  ...subadmin.interested_deals_data,
                ];
              }
              if (Array.isArray(subadmin.not_interested_deals_data)) {
                allNotInterestedDeals = [
                  ...allNotInterestedDeals,
                  ...subadmin.not_interested_deals_data,
                ];
              }
            });

            setDeals(allInterestedDeals);
            setShowDeals(allInterestedDeals);
            setNotInterestedDeals(allNotInterestedDeals);
            setLocalContextState((prev) => ({
              ...prev,
              investorName: data.user_name || "",
            }));
          } else {
            setDeals([]);
            setNotInterestedDeals([]);
            setLocalContextState((prev) => ({
              ...prev,
              investorName: data.user_name || "User",
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching deals:", error);
          setDeals([]);
        })
        .finally(() => {
          setLoading(false);
          setHasLoaded(true);
        });
    };
    fetchDeals();
  }, [setLocalContextState, hasLoaded, localContextState.userId]);

  const goInsideDeal = (dealId: string) => {
    setLocalContextState((prev) => ({
      ...prev,
      dealId: dealId,
    }));
    // Use direct route replacement to properly navigate to the deal details page
    navigate(`/home/deal-details/${dealId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 backdrop-blur text-center">
          <div className="w-15 h-15 border-4 border-gray-700 border-t-[#00fb57] rounded-full animate-spin mx-auto mb-5"></div>
          <h2 className="text-2xl font-medium text-[#FDFDFD] mb-2">
            Loading Dashboard
          </h2>
          <p className="text-sm text-gray-400 m-0">
            Please wait while we load your investment data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white overflow-hidden box-border">
      {/* Scrollable Content */}
      <div className="flex-1 p-4 overflow-auto pb-24">
        {/* Tabs Section */}
        <div className="flex mb-4 border-b border-[#333333] gap-2">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              tabChange ? "text-white" : "text-gray-400"
            }`}
            onClick={() => {
              setTabChange(true);
              setShowDeals(deals);
            }}
          >
            <div
              className={`pb-2 ${tabChange ? "border-b-2 border-white" : ""}`}
            >
              Available Deals
            </div>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              !tabChange ? "text-white" : "text-gray-400"
            }`}
            onClick={() => {
              setTabChange(false);
              setShowDeals(notInterestedDeals);
            }}
          >
            <div
              className={`pb-2 ${!tabChange ? "border-b-2 border-white" : ""}`}
            >
              Not Interested
            </div>
          </button>
        </div>

        {/* Deals Cards */}
        {showDeals.length > 0 ? (
          <div className="flex flex-col gap-4">
            {showDeals
              .filter((deal) => deal.deal_status !== "closed")
              .map((deal) => {
                const initials = getInitials(deal.title);
                const colors = getPastelColor(deal.title);
                return (
                <div
                  key={deal.deal_id}
                  className="bg-[#171717] border border-[#333333] rounded-none overflow-hidden"
                >
                  <div className="p-4">
                    {/* Company Logo & Stage */}
                    <div className="flex mb-2 justify-between">
                      <div 
                        className="h-16 w-16 flex items-center justify-center rounded-xs" 
                        style={{
                          backgroundColor: colors.background
                        }}
                      >
                        <span 
                          className="font-semibold text-4xl"
                          style={{color: colors.text}}
                        >
                          {initials}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <span className="bg-[#333333] text-white text-[10px] px-2 py-1 font-medium max-h-fit">
                          {deal.business_model}
                        </span>
                        <span className="bg-[#333333] text-white text-[10px] px-2 py-1 font-medium max-h-fit">
                          {deal.company_stage}
                        </span>
                      </div>
                    </div>

                    {/* Company Name & Description */}
                    <h3 className="text-white text-lg font-bold mb-1">
                      {deal.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-4">
                      {deal.description && deal.description.length > 60
                        ? `${deal.description.substring(0, 60)}...`
                        : deal.description ||
                          "We are a Ed-Tech company building CRM for local institutes"}
                    </p>

                    {/* Deal Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs m-0">Round size</p>
                        <p className="text-white text-sm font-medium">
                          {formatIndianCurrency(deal.round_size)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs m-0">Commitments</p>
                        <p className="text-white text-sm font-medium">
                          {formatIndianCurrency(deal.commitment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs m-0">Valuation</p>
                        <p className="text-white text-sm font-medium">
                          {formatIndianCurrency(deal.current_valuation)}
                        </p>
                      </div>
                    </div>

                    {/* Posted By & View Button */}
                    <div className="flex justify-end items-center">
                      <button
                        onClick={() => goInsideDeal(deal.deal_id)}
                        className="bg-white text-black text-xs px-4 py-2 font-medium flex items-center"
                      >
                        View deal <span className="ml-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )})}
          </div>
        ) : (
          <div className="bg-[#171717] p-6 text-center border border-[#333333]">
            <div className="text-4xl mb-4 flex justify-center">
              <RiFileChartLine className="text-[#FF69B4]" />
            </div>
            <h4 className="text-white text-base font-semibold mb-2">
              No Deals Available
            </h4>
            <p className="text-gray-400 text-sm m-0">
              We're currently preparing new investment opportunities for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
