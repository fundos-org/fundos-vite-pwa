import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// const testDeals = [{
//     "deal_id": "c20f1e4d-1cef-4b46-b5bd-34eee8bac28b",
//     "description": "Car Ev maker",
//     "title": "Tesla",
//     "deal_status": "closed",
//     "current_valuation": 323232332,
//     "round_size": 32323222,
//     "commitment": 32324242,
//     "minimum_investment": 3322323,
//     "business_model": "sharing_economy",
//     "company_stage": "ideal",
//     "logo_url": "subadmin/deals/logos/c20f1e4d-1cef-4b46-b5bd-34eee8bac28b_20250628051427.svg",
//     "created_at": "2025-06-28T05:15:38.173463"
// },
// {
//     "deal_id": "c20f1e4d-1cef-4b46-b5bd-34eee8bac28b",
//     "description": "Car Ev maker",
//     "title": "Tesla",
//     "deal_status": "open",
//     "current_valuation": 323232332,
//     "round_size": 32323222,
//     "commitment": 32324242,
//     "minimum_investment": 3322323,
//     "business_model": "sharing_economy",
//     "company_stage": "ideal",
//     "logo_url": "subadmin/deals/logos/c20f1e4d-1cef-4b46-b5bd-34eee8bac28b_20250628051427.svg",
//     "created_at": "2025-06-28T05:15:38.173463"
//     },
// {
//     "deal_id": "c20f1e4d-1cef-4b46-b5bd-34eee8bac28b",
//     "description": "Car Ev maker",
//     "title": "Tesla",
//     "deal_status": "on_hold",
//     "current_valuation": 323232332,
//     "round_size": 32323222,
//     "commitment": 32324242,
//     "minimum_investment": 3322323,
//     "business_model": "sharing_economy",
//     "company_stage": "ideal",
//     "logo_url": "subadmin/deals/logos/c20f1e4d-1cef-4b46-b5bd-34eee8bac28b_20250628051427.svg",
//     "created_at": "2025-06-28T05:15:38.173463"
// }]

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
                allInterestedDeals = [...allInterestedDeals, ...subadmin.interested_deals_data];
              }
              if (Array.isArray(subadmin.not_interested_deals_data)) {
                allNotInterestedDeals = [...allNotInterestedDeals, ...subadmin.not_interested_deals_data];
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
          toast("Welcome to FundOS Dashboard", { icon: "🟢" });
        })
        .finally(() => {
          setLoading(false);
          setHasLoaded(true);
        });
    };
    fetchDeals();
  }, [setLocalContextState, hasLoaded, localContextState.userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("phoneNumber");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("investorType");
    sessionStorage.removeItem("panNumber");
    toast.success("Logged out successfully");
    navigate(eRoutes.PHONE_NUMBER);
  };

  const goInsideDeal = (dealId: string) => {
    setLocalContextState((prev) => ({
      ...prev,
      dealId: dealId,
    }));
    navigate(eRoutes.DEAL_DETAILS_HOME);
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
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex flex-col text-white overflow-hidden box-border">
      {/* Scrollable Content */}
      <div className="flex-1 p-8 overflow-auto pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-2xl font-bold m-0">
            <span className="mx-2 align-text-bottom">🏠</span> Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white text-sm font-semibold px-3 py-2 cursor-pointer border-none"
          >
            Logout
          </button>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-[#00fb57] text-xl font-semibold mb-2 m-0">
            Hey {localContextState.investorName}! 👋
          </h2>
          <p className="text-gray-400 text-sm m-0 leading-relaxed">
            Welcome to your investment dashboard. Your KYC is complete and
            you're ready to explore deals!
          </p>
        </div>

        {/* Deals Section */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <div className="w-full flex mb-4 border-b border-[#393738] justify-around md:justify-start gap-4">
              <button
                className={`px-6 py-2 rounded-t bg-white/10 text-white font-semibold border-b-2 ${
                  tabChange ? "border-[#00fb57]" : "border-transparent"
                }`}
                onClick={() => {
                  setTabChange(true);
                  setShowDeals(deals);
                }}
              >
                Available Deals
              </button>
              <button
                className={`px-6 py-2 rounded-t bg-white/10 text-white font-semibold border-b-2 ${
                  !tabChange ? "border-[#00fb57]" : "border-transparent"
                }`}
                onClick={() => {
                  setTabChange(false);
                  setShowDeals(notInterestedDeals);
                }}
              >
                Not Interested
              </button>
            </div>
          </div>
          {showDeals.length > 0 ? (
            <div className="flex-1 md:flex  overflow-y-auto gap-4">
              {showDeals
                .filter((deal) => deal.deal_status !== "closed")
                .map((deal) => (
                  <div
                    key={deal.deal_id}
                    className="md:w-1/3 bg-white/10 p-6 mb-4 border border-white/15 shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white text-base font-semibold m-0 flex-1">
                        {deal.title}
                      </h4>
                      <span
                        className={`
                                            ${
                                              deal.deal_status === "open"
                                                ? "bg-[#00fb57]"
                                                : ""
                                            }
                                            ${
                                              deal.deal_status === "closed"
                                                ? "bg-[#fd8888]"
                                                : ""
                                            }
                                            ${
                                              deal.deal_status === "on_hold"
                                                ? "bg-[#ffb800]"
                                                : ""
                                            }
                                            text-black text-xs font-semibold px-2 py-1 ml-2
                                        `}
                      >
                        {deal.deal_status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs m-0 mb-4 leading-snug">
                      {deal.description.length > 100
                        ? deal.description.substring(0, 100) + "..."
                        : deal.description}
                    </p>

                    {/* Deal Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#00fb571a] p-2.5 border border-[#00fb5733]">
                        <p className="text-[#00fb57] text-[10px] m-0 mb-1 font-semibold uppercase">
                          Round Size
                        </p>
                        <p className="text-white text-sm font-bold m-0">
                          ₹{(deal.round_size / 10000000).toFixed(1)}Cr
                        </p>
                      </div>
                      <div className="bg-white/10 p-2.5 border border-white/10">
                        <p className="text-gray-400 text-[10px] m-0 mb-1 font-semibold uppercase">
                          Min. Investment
                        </p>
                        <p className="text-white text-sm font-bold m-0">
                          ₹{(deal.minimum_investment / 10000000).toFixed(2)}Cr
                        </p>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    {/* <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <p className="text-[#00fb57] text-xs m-0 font-semibold">
                                            🎯 Funding Progress
                                        </p>
                                        <p className="text-white text-xs m-0 font-semibold">
                                            {Math.floor(Math.random() * 40 + 10)}%
                                        </p>
                                    </div>
                                    <div className="h-1.5 bg-white/10 overflow-hidden border border-white/10">
                                        <div
                                            className="h-full transition-all duration-800"
                                            style={{
                                                background:
                                                    'linear-gradient(90deg, #00fb57 0%, #00d647 100%)',
                                                width: `${Math.floor(Math.random() * 40 + 10)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div> */}

                    <button
                      onClick={() => goInsideDeal(deal.deal_id)}
                      className="bg-gradient-to-br from-[#00fb57] to-[#00d647] text-[#1a1a1a] border-none px-4 py-2 text-xs font-semibold cursor-pointer w-full transition-all duration-300"
                    >
                      📊 View Details
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white/10 p-8 text-center border border-white/10">
              <div className="text-5xl mb-4">💼</div>
              <h4 className="text-white text-base font-semibold mb-2 m-0">
                No Deals Available
              </h4>
              <p className="text-gray-400 text-sm m-0 leading-relaxed">
                We're currently preparing exciting investment opportunities for
                you. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
