import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyInvestments, getInitials, Investment } from "@/data/dummyInvestments";

const InvestmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { investmentId } = useParams<{ investmentId: string }>();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [investment, setInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    if (investmentId) {
      const foundInvestment = dummyInvestments.find(inv => inv.id === Number(investmentId));
      if (foundInvestment) {
        setInvestment(foundInvestment);
      } else {
        navigate("/home/dashboard/portfolio");
      }
    }
  }, [investmentId, navigate]);

  if (!investment) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Function to toggle description expansion
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Function to get shortened description
  const getShortenedDescription = (desc: string) => {
    return desc.length > 60 ? `${desc.substring(0, 60)}...` : desc;
  };

  const handleBack = () => {
    navigate("/home/dashboard/portfolio");
  };

  return (
    <div className="flex flex-col text-white overflow-y-auto pb-32 p-4 box-border">
      <div className="flex items-center mb-4">
        <button onClick={handleBack} className="p-3 bg-black/20 rounded-xs mr-4">
          ←
        </button>
        <h2 className="text-xl font-light opacity-80">Investments</h2>
      </div>

      <div className="mb-6 flex items-start">
        <div
          className={`w-12 h-12 flex flex-col items-center justify-center ${investment.bgColor} rounded-xs mr-4`}
        >
          <span className={`${investment.textColor} font-bold`}>
            {getInitials(investment.name)}
          </span>
          <span className={`text-xs ${investment.textColor} block`}>
            Startup
          </span>
        </div>
        <div className="text-left">
          <h1 className="text-3xl font-bold">{investment.name}</h1>
          <p className="text-gray-400 text-sm">
            {isDescriptionExpanded
              ? investment.description
              : getShortenedDescription(investment.description)}
            <button
              onClick={toggleDescription}
              className="text-gray-300 ml-1 focus:outline-none hover:underline"
            >
              {isDescriptionExpanded ? "Show less" : "See more"}
            </button>
          </p>
        </div>
      </div>

      <div className="text-left mb-6">
        <p className="text-gray-400 uppercase text-xs mb-2">
          INVESTMENT DETAILS
        </p>

        <div className="bg-[#242424] rounded-xs p-4 mb-3">
          <p className="text-gray-400 text-sm">Current valuation</p>
          <p className="text-2xl font-bold">
            ₹{investment.valuation}{" "}
            <span className="text-gray-400 text-sm">(Post)</span>
          </p>
        </div>

        <div className="bg-[#242424] rounded-xs p-4 mb-3">
          <p className="text-gray-400 text-sm">Round</p>
          <p className="text-2xl font-bold">{investment.round}</p>
        </div>

        <div className="bg-[#242424] rounded-xs p-4 mb-3">
          <p className="text-gray-400 text-sm">My investments</p>
          <p className="text-2xl font-bold">₹{investment.myInvestment}</p>
        </div>

        <div className="bg-[#242424] rounded-xs p-4 mb-3">
          <p className="text-gray-400 text-sm">Shares allocated</p>
          <p className="text-2xl font-bold">{investment.sharesAllocated}</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <button className="w-full p-3 border border-white/20 rounded-xs text-white">
          Download term sheet
        </button>
        <button className="w-full p-3 border border-white/20 rounded-xs text-white">
          Download share certificate
        </button>
        <button className="w-full p-3 border border-white/20 rounded-xs text-white">
          View transaction details
        </button>
        <button className="w-full p-3 bg-white rounded-xs text-black mt-4 flex items-center justify-center">
          Invest more <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default InvestmentDetail;
