import { eRoutes } from '@/RoutesEnum';
import { useHomeContext } from '@/Shared/useLocalContextState';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CommitInvestment: React.FC = () => {
  const navigate = useNavigate();
  const { localContextState, setLocalContextState } = useHomeContext();
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [parsedAmount, setParsedAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const deal = localContextState.dealDetails || null;

  useEffect(() => {
    const cleanAmount = investmentAmount.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanAmount);
    setParsedAmount(isNaN(num) ? 0 : num);
  }, [investmentAmount]);

  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) {
      return '₹ 0';
    }
    return `₹ ${value.toLocaleString('en-IN', {
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

  const managementFeeRate = deal?.management_fee || 0;
  const managementFee = parsedAmount * (managementFeeRate / 100);
  const gst = managementFee * 0.18;
  const total = parsedAmount + managementFee + gst;

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
    <>
      <div>
      <h1 className="text-white text-[1.8rem] font-bold mb-8">
        💰 Commit Investment
      </h1>

      {/* Deal Info Card */}
      <div>
        <h2 className="text-[#00fb57] text-[1.2rem] font-semibold mb-2">
        {deal.title}
        </h2>
        <p className="text-gray-300 text-sm mb-8 leading-[1.5]">
        {deal.description}
        </p>
      </div>

      {/* Investment Input Section */}
      <div>
        <h3 className="text-white text-[1.2rem] font-semibold mb-4">
        📊 Investment Amount
        </h3>
        <div className="mb-4">
        <label className="text-gray-400 text-sm mb-2 block font-semibold">
          Enter amount in INR
        </label>
        <input
          type="text"
          value={investmentAmount}
          onChange={(e) => handleInvestmentAmountChange(e.target.value)}
          placeholder="0"
          className="w-full p-[14px] text-lg bg-white/10 border border-white/30 text-white outline-none font-bold box-border"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-400 text-xs m-0">
          Minimum: {formatCurrency(deal.minimum_investment)}
          </p>
          {parsedAmount > 0 && (
          <p
            className={`text-sm m-0 font-semibold ${
            parsedAmount >= deal.minimum_investment
              ? 'text-[#00fb57]'
              : 'text-red-500'
            }`}
          >
            {parsedAmount >= deal.minimum_investment
            ? '✓ Valid Amount'
            : '✗ Below Minimum'}
          </p>
          )}
        </div>
        </div>
        </div>
        <button
        onClick={handleInputChange}
        disabled={!isInvestmentValid}
        className={`w-full font-bold text-base p-[14px] transition-all duration-300 ${
          isInvestmentValid
          ? 'bg-[#00fb57] text-[#1a1a1a] border-none cursor-pointer'
          : 'bg-white/10 text-gray-400 border border-white/30 cursor-not-allowed'
        }`}
        >
        📈 Calculate Investment Summary
        </button>
      

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
            {deal.carry ? `${deal.carry}%` : 'N/A'}
          </span>
          </div>
          <div className="h-px bg-[#333] my-4"></div>
          <div className="flex justify-between">
          <span className="text-[#00fb57] text-base font-bold">
            Total Amount:
          </span>
          <span className="text-[#00fb57] text-base font-bold">
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
            ? 'bg-[#00fb57] text-[#1a1a1a] border-none cursor-pointer'
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
      </>
  );
};

export default CommitInvestment;
