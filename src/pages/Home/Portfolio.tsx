import React from "react";
import { useNavigate } from "react-router-dom";
import { dummyInvestments, getInitials } from "@/data/dummyInvestments";

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const totalInvestment = "18.25Cr";
  const dealsCount = dummyInvestments.length;

  const handleInvestmentClick = (investmentId: number) => {
    navigate(`${investmentId}`);
  };

  return (
    <div className="h-screen w-screen flex flex-col text-white overflow-hidden m-0 p-0 box-border mb-24">
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
            You have invested in {dealsCount} deals
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button className="px-5 py-2.5 bg-black/30 rounded-full text-sm inline-flex items-center hover:bg-black/40 transition-colors">
            <img src="/portfolio.svg" alt="portfolio" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyInvestments.map((investment) => (
            <div
              key={investment.id}
              onClick={() => handleInvestmentClick(investment.id)}
              className="bg-[#242424] p-4 rounded-xs flex flex-col border border-white/10 cursor-pointer h-full"
            >
              <div className="flex items-center mb-3">
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
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{investment.name}</h3>
                  <div className="flex space-x-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-xs">
                      {investment.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-xs">
                      {investment.round}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 my-2"></div>

              <div className="flex justify-between items-center pt-1 text-sm mt-auto">
                <p className="text-xs text-gray-400">
                  Invested on {investment.investedOn}
                </p>
                <p className="font-medium text-right">
                  ₹{investment.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
