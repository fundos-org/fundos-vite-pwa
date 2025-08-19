import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { eRoutes } from "@/RoutesEnum";
import { Eye } from "lucide-react";

interface PortfolioData {
  totalInvestment: string;
  userName: string;
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const { localContextState } = useHomeContext();
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalInvestment: "0",
    userName: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    const userName = localStorage.getItem("name") || "User";
    const investmentAmount = parseFloat(localStorage.getItem("investmentAmount") || "0");
    
    // Format investment amount in Cr
    const formatInvestmentAmount = (amount: number): string => {
      if (amount === 0) return "0Cr";
      
      const inCrores = amount / 10000000; // Convert to crores
      if (inCrores >= 1) {
        return `${inCrores.toFixed(2)}Cr`;
      } else {
        // For amounts less than 1 crore, still show in Cr with more decimal places
        return `${inCrores.toFixed(4)}Cr`;
      }
    };

    setPortfolioData({
      totalInvestment: formatInvestmentAmount(investmentAmount),
      userName: userName,
    });
  }, [localContextState.investorName]);

  // Function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters
  };

  // Function to generate a consistent pastel color based on username
  const generatePastelColor = (name: string): string => {
    // Simple hash function for the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate pastel color (higher lightness, lower saturation)
    const h = hash % 360;
    const s = 55 + (hash % 20); // 55-75% saturation
    const l = 75 + (hash % 15); // 75-90% lightness

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-b from-[#8b1a48] to-black p-4 pb-8">
        {/* User Greeting */}
        <div className="rounded-full bg-black/20 py-2 px-4 mb-6 max-w-fit">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: generatePastelColor(portfolioData.userName),
              }}
            >
              <span className="text-black font-semibold text-sm">
                {getInitials(portfolioData.userName)}
              </span>
            </div>
            <h1 className="text-lg font-medium">
              Hi {portfolioData.userName.split(" ")[0]}!
            </h1>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-6">
          <h2 className="text-base text-white/70 mb-2">Portfolio overview</h2>
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold">
              ₹{portfolioData.totalInvestment}
            </h1>
            <button
              className="text-white/70"
              onClick={() => navigate(eRoutes.DASHBOARD_PORTFOLIO)}
            >
              <Eye size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards - No Gradient */}
      <div className="space-y-4 p-4 mt-2">
        {/* Portfolio Card */}
        <div
          className="bg-[#242325] px-4 py-3 rounded-xs border border-white/10 cursor-pointer"
          onClick={() => navigate(eRoutes.DASHBOARD_PORTFOLIO)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl text-[#a679c7]">
                View portfolio <span className="ml-1">→</span>
              </h3>
              <p className="text-sm text-white/70 mt-1">
                View and track your investments
              </p>
            </div>
          </div>
        </div>

        {/* Deals Card */}
        <div
          className="bg-[#242325] px-4 py-3 rounded-xs border border-white/10 cursor-pointer"
          onClick={() => navigate(eRoutes.DASHBOARD_DEALS)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl text-[#ff8ac2]">
                Explore deals <span className="ml-1">→</span>
              </h3>
              <p className="text-sm text-white/70 mt-1">Explore new deals</p>
            </div>
          </div>
        </div>

        {/* Transaction Card */}
        <div
          className="bg-[#242325] px-4 py-3 rounded-xs border border-white/10 cursor-pointer"
          onClick={() =>
            navigate(`${eRoutes.DASHBOARD_HOME}${eRoutes.TRANSACTIONS}`)
          }
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl text-[#9cb5ff]">
                View transaction <span className="ml-1">→</span>
              </h3>
              <p className="text-sm text-white/70 mt-1">
                View and track your transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
