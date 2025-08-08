import { eRoutes } from "@/RoutesEnum";
import { useHomeContext } from "@/Shared/useLocalContextState";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import api from "@/lib/axiosInstance";

const CommitInvestment: React.FC = () => {
  const navigate = useNavigate();
  const { dealId } = useParams(); // Get dealId from URL params
  const { setLocalContextState } = useHomeContext();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [parsedAmount, setParsedAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
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

  useEffect(() => {
    const cleanAmount = investmentAmount.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleanAmount);
    setParsedAmount(isNaN(num) ? 0 : num);

    // Show summary if amount is valid
    if (num && !isNaN(num) && num >= (deal?.minimum_investment || 0)) {
      setShowSummary(true);
    } else {
      setShowSummary(false);
    }
  }, [investmentAmount, deal]);

  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) {
      return "₹0";
    }
    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  const handleInvestmentAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, "");
    const parts = cleanText.split(".");
    if (parts.length > 2) {
      return;
    }
    setInvestmentAmount(cleanText);
  };

  const handleInputChange = () => {
    const value = parseFloat(investmentAmount) || 0;
    const minValue = deal?.minimum_investment || 0;

    if (value < minValue) {
      toast.error(`Minimum Investment Amount: ${formatCurrency(minValue)}`);
    } else {
      handleContinue();
    }
  };

  const handleContinue = () => {
    if (!checked) {
      toast.error("Please check the acknowledgment to continue");
      return;
    }

    try {
      setLocalContextState((prev) => ({
        ...prev,
        investmentAmount: investmentAmount ?? "",
      }));
      navigate(eRoutes.TERM_SHEET_HOME);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  // Calculate using the deal's management fee and carry
  const managementFeeRate = (deal?.management_fee || 0) * 100;
  const managementFee = parsedAmount * (managementFeeRate / 100);
  const gst = managementFee * 0.18;

  const carryPercentage = (deal?.carry || 0) * 100;
  const carryAmount = parsedAmount * (carryPercentage / 100);
  const total = parsedAmount + managementFee + gst + carryAmount;

  const isInvestmentValid =
    parsedAmount > 0 && parsedAmount >= (deal?.minimum_investment || 0);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center justify-center text-white">
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
      <div className="bg-black flex flex-col text-white overflow-hidden box-border">
        {/* Back Icon */}
        <button
          onClick={() => navigate(eRoutes.DEAL_DETAILS_HOME)}
          className="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-4 self-start z-10 mb-20"
        >
          <IoArrowBack />
        </button>
        {/* Scrollable Content */}
        <div className="flex-1 p-8 overflow-auto pb-24 max-w-[500px] mx-auto">
          <div className="w-full max-w-[400px] bg-white/5 border border-white/10 p-8 backdrop-blur text-center mx-auto">
            <h2 className="text-2xl font-medium text-[#FDFDFD] mb-5">
              Deal Not Found
            </h2>
            <button
              onClick={() => navigate(eRoutes.DASHBOARD_HOME)}
              className="bg-[#00fb57] text-[#1a1a1a] border-none px-6 py-3 text-sm font-semibold cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col py-6 px-4">
      {/* Company Info Header */}
      <div className="bg-[#222] p-2 flex gap-4 mb-4">
        <div
          className="h-16 w-16 flex items-center justify-center rounded max-h-12"
          style={{
            backgroundColor: "#f0e6ff", // Pastel background color
          }}
        >
          <span className="text-[#6c46d6] text-xs font-bold">
            {deal.title
              ? deal.title
                  .split(" ")
                  .map((word: string) => word[0])
                  .join("")
                  .toUpperCase()
              : "N/A"}
          </span>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold m-0">
            {deal.title || "Infotech Pvt. Ltd."}
          </h2>
          <p className="text-gray-400 text-xs m-0">
            {deal.description ||
              "We are an Ed-tech company building CRM for local institutes"}
          </p>
        </div>
      </div>

      {/* Investment Amount Section */}
      <div className="flex flex-col">
        <p className="text-gray-400 text-sm mb-2">
          How much you want to invest?
        </p>
        <div className="bg-[#222] p-4 mb-4 text-center">
          <input
            type="text"
            value={investmentAmount ? `₹${investmentAmount}` : ""}
            onChange={(e) =>
              handleInvestmentAmountChange(e.target.value.replace(/[₹]/g, ""))
            }
            placeholder="₹0"
            className="w-full bg-transparent border-none text-white text-3xl font-bold text-center outline-none"
          />
        </div>

        {/* Calculation Summary */}
        {showSummary && (
          <div className="mb-6">
            <div className="border-t border-gray-700 pt-2 mb-4">
              <div className="text-gray-400 text-sm text-center">
                Total payable
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Invest amount</span>
              <span className="text-white text-sm">
                {formatCurrency(parsedAmount)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">
                Management fee ({managementFeeRate}%)
              </span>
              <span className="text-white text-sm">
                {formatCurrency(managementFee)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">GST (18%)</span>
              <span className="text-white text-sm">{formatCurrency(gst)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">
                Carry ({carryPercentage}%)
              </span>
              <span className="text-white text-sm">
                {formatCurrency(carryAmount)}
              </span>
            </div>

            <div className="flex justify-between mt-4 pt-2 border-t border-gray-700">
              <span className="text-white text-sm font-semibold">To pay</span>
              <span className="text-white text-sm font-semibold">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start mb-6 gap-2.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={toggleCheckbox}
            className="mt-[2px] cursor-pointer"
          />
          <label
            onClick={toggleCheckbox}
            className="text-gray-300 text-xs leading-[1.4] cursor-pointer"
          >
            I acknowledge that I have read and understood the investment terms
            and conditions. I confirm that the investment amount and associated
            fees are correct.
          </label>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleInputChange}
          disabled={!isInvestmentValid || !checked}
          className={`w-full font-semibold text-base p-3 transition-all duration-300 flex justify-center items-center ${
            isInvestmentValid && checked
              ? "bg-white text-black cursor-pointer"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed to pay <span className="ml-2">→</span>
        </button>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="bg-black/80 flex items-center justify-center z-[1000] p-5">
          <div className="bg-[#1a1a1a]/95 p-8 w-full max-w-[400px] border border-white/10 backdrop-blur">
            <h3 className="text-white text-[1.5rem] font-bold mb-6 text-start">
              📊 Investment Summary
            </h3>

            <div className="mb-6">
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-300 text-sm">
                  Investment Amount:
                </span>
                <span className="text-white text-sm font-bold">
                  {formatCurrency(parsedAmount)}
                </span>
              </div>
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-300 text-sm">
                  Management Fee ({managementFeeRate}%):
                </span>
                <span className="text-white text-sm font-bold">
                  {formatCurrency(managementFee)}
                </span>
              </div>
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-300 text-sm">GST (18%):</span>
                <span className="text-white text-sm font-bold">
                  {formatCurrency(gst)}
                </span>
              </div>
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-300 text-sm">Carry:</span>
                <span className="text-white text-sm font-bold">
                  {carryPercentage}%
                </span>
              </div>
              <div className="h-px bg-[#333] my-4"></div>
              <div className="flex justify-between">
                <span className="text-white text-base font-bold">
                  Total Amount:
                </span>
                <span className="text-white text-base font-bold">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={handleModalClose}
                className="bg-white/10 text-white text-sm font-semibold p-3 border border-white/30 cursor-pointer flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!checked}
                className={`text-sm font-semibold p-3 flex-1 ${
                  checked
                    ? "bg-white text-black border-none cursor-pointer"
                    : "bg-white/10 text-gray-400 border border-white/30 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitInvestment;
