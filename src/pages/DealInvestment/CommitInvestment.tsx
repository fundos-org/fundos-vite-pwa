import { eRoutes } from '@/RoutesEnum';
import { useHomeContext } from '@/Shared/useLocalContextState';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const CommitInvestment: React.FC = () => {
  const navigate = useNavigate();
  const { localContextState, setLocalContextState } = useHomeContext();
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [parsedAmount, setParsedAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const deal = localContextState.dealDetails || null;

  useEffect(() => {
    const cleanAmount = investmentAmount.replace(/[^0-9.]/g, '');
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
      return '₹0';
    }
    return `₹${value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`;
  };

  const handleInvestmentAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, '');
    const parts = cleanText.split('.');
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
      setModalVisible(true);
    }
  };

  const handleContinue = () => {
    if (!checked) {
      toast.error('Please check the acknowledgment to continue');
      return;
    }

    try {
      setLocalContextState((prev) => ({
        ...prev,
        investmentAmount: investmentAmount ?? '',
      }));
      navigate(eRoutes.TERM_SHEET_HOME);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Navigation failed. Please try again.');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  // Calculate using the deal's management fee and carry
  const managementFeeRate = deal?.management_fee || 0;
  const managementFee = parsedAmount * (managementFeeRate / 100);
  const gst = managementFee * 0.18; // 18% GST on management fee
  const total = parsedAmount + managementFee + gst;
  const carryPercentage = deal?.carry || 0;

  const isInvestmentValid = parsedAmount > 0 && parsedAmount >= (deal?.minimum_investment || 0);

  if (!deal) {
    return (
      <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white overflow-hidden box-border">
        {/* Back Icon */}
        <button
          onClick={() => navigate(eRoutes.DEAL_DETAILS_HOME)}
          className="bg-transparent border-none text-gray-400 text-2xl cursor-pointer p-4 self-start z-10 mb-20"
        >
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
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col">
      {/* Back Button and Title */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button 
          onClick={() => navigate(eRoutes.DEAL_DETAILS_HOME)}
          className="p-2 mr-4 bg-[#222222] rounded-sm flex items-center justify-center"
        >
          <IoArrowBack className="text-white text-lg" />
        </button>
        <h1 className="text-white text-lg font-medium">Commit to invest</h1>
      </div>

      {/* Company Info Header */}
      <div className="bg-[#222] p-4 flex items-center gap-4 mb-4">
        <div className="bg-[#f0e6ff] h-12 w-12 flex items-center justify-center rounded">
          <span className="text-[#6c46d6] text-xs font-bold">Startup</span>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold m-0">{deal.title || "Infotech Pvt. Ltd."}</h2>
          <p className="text-gray-400 text-xs m-0">{deal.description || "We are a Ed-tech company building CRM for local institutes"}</p>
        </div>
      </div>

      {/* Investment Amount Section */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-gray-400 text-sm mb-2">How much you want to invest?</p>
        <div className="bg-[#222] p-6 mb-4 text-center">
          <input
            type="text"
            value={investmentAmount ? `₹${investmentAmount}` : ''}
            onChange={(e) => handleInvestmentAmountChange(e.target.value.replace(/[₹]/g, ''))}
            placeholder="₹0"
            className="w-full bg-transparent border-none text-white text-3xl font-bold text-center outline-none"
          />
        </div>

        {/* Calculation Summary */}
        {showSummary && (
          <div className="mb-6">
            <div className="border-t border-gray-700 pt-2 mb-4">
              <div className="text-gray-400 text-sm text-center">Total payable</div>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Invest amount</span>
              <span className="text-white text-sm">{formatCurrency(parsedAmount)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Management fee ({managementFeeRate}%)</span>
              <span className="text-white text-sm">{formatCurrency(managementFee)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">GST (18%)</span>
              <span className="text-white text-sm">{formatCurrency(gst)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Carry</span>
              <span className="text-white text-sm">{carryPercentage}%</span>
            </div>
            
            <div className="flex justify-between mt-4 pt-2 border-t border-gray-700">
              <span className="text-white text-sm font-semibold">To pay</span>
              <span className="text-white text-sm font-semibold">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
        
        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Proceed Button at the bottom */}
        <button
          onClick={handleInputChange}
          disabled={!isInvestmentValid}
          className={`w-full font-semibold text-base p-3 transition-all duration-300 flex justify-center items-center mt-auto ${
            isInvestmentValid
            ? 'bg-white text-black cursor-pointer'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Proceed to pay <span className="ml-2">→</span>
        </button>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-5">
          <div className="bg-[#1a1a1a]/95 p-8 w-full max-w-[400px] border border-white/10 backdrop-blur">
            <h3 className="text-white text-[1.5rem] font-bold mb-6 text-start">
              📊 Investment Summary
            </h3>

            <div className="mb-6">
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-300 text-sm">Investment Amount:</span>
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

            {/* Acknowledgment Checkbox */}
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
                I acknowledge that I have read and understood the investment terms and conditions.
                I confirm that the investment amount and associated fees are correct.
              </label>
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
                  ? 'bg-white text-black border-none cursor-pointer'
                  : 'bg-white/10 text-gray-400 border border-white/30 cursor-not-allowed'
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
