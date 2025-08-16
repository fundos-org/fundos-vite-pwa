import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useHomeContext } from "@/Shared/useLocalContextState";
import api from "@/lib/axiosInstance";
import { HiOutlineArrowLeft } from "react-icons/hi";

function TermSheet() {
  const navigate = useNavigate();
  const { localContextState } = useHomeContext();
  const { dealId, investmentAmount, userId, investorName } = localContextState;
  const [sectionChecks, setSectionChecks] = useState({
    section1: false,
    section2: false,
    finalConfirmation: false,
  });

  const allChecked = Object.values(sectionChecks).every(Boolean);

  const toggleCheckbox = (section: keyof typeof sectionChecks) => {
    setSectionChecks((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleClick = async () => {
    const data = {
      user_id: userId ?? "",
      investment_amount: Number(investmentAmount),
      deal_id: dealId ?? "",
    };

    api
      .post("/deal/send/drawdown-notice", {}, { params: data })
      .then((response) => {
        if (response.status !== 200) {
          const errorData = response.data || {};
          toast.error(errorData?.message || "Unexpected error took place");
          throw new Error(errorData?.message || "Unexpected error took place");
        }
        
        sessionStorage.setItem("s3_key", response.data.s3_key);
        toast.success("Draw Down Notice sent successfully to registered email");
        navigate(eRoutes.DRAW_DOWN_NOTICE_HOME);
      })
      .catch((error) => {
        toast.error(error?.message || "An unexpected error occurred");
        throw new Error(error?.message || "An unexpected error occurred");
      });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh)] text-white p-4">
      {/* Header */}
      <div className="flex flex-col flex-grow overflow-auto">
        {/* Top bar with back button */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none"
          >
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-muted/50">Term Sheet</h1>
        </div>

        {/* Details */}
        <div>
          <div className="text-sm flex flex-col">
            <span className="capitalize text-muted/40">Investor Name: </span>
            <span className="font-semibold">{investorName}</span>
            <br />
            <span className="text-sm text-muted/40">Date:</span>
            <span className="font-semibold"> {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Section 1: Investment Terms */}
        <div className="mt-6">
          <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-2">
            <label
              htmlFor="section1"
              className="font-semibold text-lg cursor-pointer"
            >
              1. Investment Terms
            </label>
            <input
              type="checkbox"
              id="section1"
              checked={sectionChecks.section1}
              onChange={() => toggleCheckbox("section1")}
              className="w-5 h-5 accent-[#546881] cursor-pointer"
            />
          </div>
          <ul className="list-disc list-inside text-gray-300 ml-4">
            <li>Investment Amt: ₹ {investmentAmount} /-</li>
          </ul>
        </div>

        {/* Section 2: Closing Conditions */}
        <div className="mt-6">
          <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-2">
            <label
              htmlFor="section2"
              className="font-semibold text-lg cursor-pointer"
            >
              2. Closing Conditions
            </label>
            <input
              type="checkbox"
              id="section2"
              checked={sectionChecks.section2}
              onChange={() => toggleCheckbox("section2")}
              className="w-5 h-5 accent-[#546881] cursor-pointer"
            />
          </div>
          <ul className="list-disc list-inside text-gray-300 ml-4">
            <li>Completion of satisfactory due diligence</li>
            <li>
              Signing of final legal documents (Shareholder Agreement,
              Subscription)
            </li>
            <li>Board approval (if applicable)</li>
          </ul>
        </div>
      </div>

      {/* Final Confirmation - Pushed to bottom */}
      <div className="flex flex-col mt-auto pt-4">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="finalConfirmation"
            checked={sectionChecks.finalConfirmation}
            onChange={() => toggleCheckbox("finalConfirmation")}
            className="w-5 h-5 mt-0.5 accent-[#546881] cursor-pointer"
          />
          <label htmlFor="finalConfirmation" className="text-sm">
            I confirm that I read all the content based on the above Terms and
            Condition(s)
            <span className="text-red-400">*</span>
          </label>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleClick}
          disabled={!allChecked}
          className="mt-6 bg-white text-gray-900 font-semibold px-8 py-4 w-full transition-all duration-300 hover:bg-white focus:outline-none disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}

export default TermSheet;
