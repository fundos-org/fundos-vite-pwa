import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const DealDetails = () => {
  const navigate = useNavigate();
  const { dealId } = useParams(); // Get dealId from URL params
  const { setLocalContextState } = useHomeContext();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealDetails = async () => {
      if (!dealId) {
        toast.error("Deal ID is missing");
        navigate(eRoutes.DASHBOARD_HOME);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/deal/", {
          params: { deal_id: dealId },
        });

        if (response.data) {
          setDeal(response.data);
          setLocalContextState((prev) => ({
            ...prev,
            dealDetails: response.data,
          }));
        } else {
          toast.error("Deal details not found");
          navigate(eRoutes.DASHBOARD_HOME);
        }
      } catch (error) {
        console.error("Error fetching deal details:", error);
        toast.error("Failed to load deal details. Please try again.");
        navigate(eRoutes.DASHBOARD_HOME);
      } finally {
        setLoading(false);
      }
    };

    fetchDealDetails();
  }, [dealId, setLocalContextState, navigate]);

  // Helper function to format currency in Indian format
  const formatIndianCurrency = (amount?: number): string => {
    if (!amount || amount === 0) return "₹0";

    // Convert to crores
    const inCrores = amount / 10000000;
    if (inCrores >= 1) {
      return `₹${inCrores.toFixed(2)}Cr`;
    }

    // Convert to lakhs
    const inLakhs = amount / 100000;
    if (inLakhs >= 1) {
      return `₹${inLakhs.toFixed(1)}L`;
    }

    return `₹${amount.toFixed(0)}`;
  };

  // Helper function to get initials from company name
  const getInitials = (name?: string): string => {
    if (!name) return "?";
    return name
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Helper function to generate a pastel color based on string
  const getPastelColor = (
    str?: string
  ): { background: string; text: string } => {
    if (!str) return { background: "#e7dff8", text: "#6138b9" };

    // Generate a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate pastel color based on hash
    const h = Math.abs(hash) % 360;
    const s = 60 + (Math.abs(hash) % 20);
    const l = 80 + (Math.abs(hash) % 10);

    // Calculate contrasting text color
    const textColor =
      l > 70
        ? `hsl(${h}, ${Math.min(100, s + 20)}%, 25%)`
        : `hsl(${h}, ${Math.min(100, s + 10)}%, 95%)`;

    return {
      background: `hsl(${h}, ${s}%, ${l}%)`,
      text: textColor,
    };
  };

  const handleCommit = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      // Check MCA status first
      const mcaResponse = await api.get("/deal/mca/status", {
        params: { deal_id: dealId, user_id: userId },
      });

      if (mcaResponse.status !== 200) {
        throw new Error("Failed to check MCA status");
      }

      navigate("commit");
    } catch (error) {
      console.error("Error in commit process:", error);
      toast.error("Failed to apply for declarations. Please try again.");
    }
  };

  const handleNotInterested = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const response = await fetch(
        `https://api.fundos.services/api/v1/live/deals/interaction?deal_id=${dealId}&user_id=${userId}&not_interested=true`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set not interested");
      }

      const data = await response.json();

      if (data?.message) {
        toast.success(data.message);
      }

      navigate(eRoutes.DASHBOARD_HOME); // Go back to dashboard
    } catch (error) {
      console.error("Error setting not interested:", error);
      toast.error("Failed to set not interested. Please try again.");
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const initials = getInitials(deal?.title);
  const colors = getPastelColor(deal?.title);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-white">
            Loading deal details...
          </h2>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 backdrop-blur text-center">
          <h2 className="text-2xl font-medium text-[#FDFDFD] mb-5">
            Deal Not Found
          </h2>
          <button
            onClick={() => navigate(eRoutes.DASHBOARD_HOME)}
            className="bg-white text-black border-none px-6 py-3 text-sm font-semibold cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-4">
      {/* Header section with company logo */}
      <div className="p-4 bg-gradient-to-b from-purple-900/50 to-black">
        <div
          className="h-16 w-16 flex items-center justify-center mb-3"
          style={{
            backgroundColor: colors.background,
          }}
        >
          <span
            className="font-semibold text-lg"
            style={{ color: colors.text }}
          >
            {initials}
          </span>
        </div>

        {/* Company name and description */}
        <h1 className="text-white text-3xl font-bold mb-2">{deal.title}</h1>
        <p
          className={`text-gray-300 text-sm mb-1 ${
            !isDescriptionExpanded && "line-clamp-2"
          }`}
        >
          {deal.description ||
            "We are a Ed-tech company building CRM for local institutes"}
        </p>
        {deal.description && (
          <button
            onClick={toggleDescription}
            className="bg-transparent border-none text-white text-sm cursor-pointer p-0 underline"
          >
            {isDescriptionExpanded ? "See less" : "See more"}
          </button>
        )}
      </div>

      {/* Deal details section */}
      <div className="p-4">
        <h2 className="text-gray-400 text-sm uppercase mb-3">DEAL DETAILS</h2>

        {/* Current valuation */}
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-1">Current valuation</p>
          <p className="text-white text-3xl font-bold">
            ₹{formatIndianCurrency(deal.current_valuation).replace("₹", "")}{" "}
          </p>
        </div>

        {/* Round */}
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-1">Round</p>
          <p className="text-white text-xl font-bold">{deal.company_stage}</p>
        </div>

        {/* Round size and minimum investment */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs mb-1">Round size</p>
            <p className="text-white text-xl font-bold">
              ₹{formatIndianCurrency(deal.round_size).replace("₹", "")}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Minimum investment</p>
            <p className="text-white text-xl font-bold">
              ₹{formatIndianCurrency(deal.minimum_investment).replace("₹", "")}
            </p>
          </div>
        </div>

        {/* Valuation type and instruments */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs mb-1">Valuation type</p>
            <p className="text-white text-xl font-bold">Priced</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Instruments</p>
            <p className="text-white text-xl font-bold">{deal.instruments}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs mb-1">
            {deal.fund_raised_till_now ?? 68}% funds raised
          </p>
          <div className="h-1 bg-gray-700 w-full">
            <div
              className="h-full bg-white"
              style={{ width: `${deal.fund_raised_till_now ?? 68}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4">
          <button
            onClick={handleCommit}
            className="bg-white text-black w-full py-3 font-bold mb-3 text-center"
          >
            Commit →
          </button>
          <button
            onClick={handleNotInterested}
            className="bg-transparent border border-gray-600 text-white w-full py-3 mb-2 text-center"
          >
            Not Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
