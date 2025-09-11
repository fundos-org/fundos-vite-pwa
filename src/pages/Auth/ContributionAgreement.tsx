import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ContributionAgreementProps {
  onNext: () => void;
  onBack: () => void;
}

const ContributionAgreement = ({ onNext, onBack }: ContributionAgreementProps) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("email") || "";

  const handleContinue = async () => {
    if (!checked) {
      toast.error(
        "Please confirm that you qualify as an Angel Investor before proceeding."
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/onboarding/zoho/sign-agreement",
        {},
        {
          params: {
            agreement_signed: checked,
          },
        }
      );

      if (data.success) {
        sessionStorage.setItem("agreementSigned", "true");
        toast.success(`Agreement sent successfully to ${email} !`);
        navigate(eRoutes.UPLOAD_PHOTO_AUTH);
      } else {
        toast.error(
          data.message || "Failed to sign agreement. Please try again."
        );
      }
    } catch (error) {
      console.error("Error signing agreement:", error);
      toast.error("Failed to sign agreement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white px-6 py-8 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="text-gray-600 text-2xl mr-4 hover:text-gray-800 transition-colors"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold text-black">
            Contribution Agreement
          </h1>
        </div>

        <div className="mb-8 leading-relaxed text-gray-700">
          <p className="text-base mb-4">
            I am an individual investor who has net tangible assets of at least
            two crore rupees excluding value of my principal residence, and:
          </p>
          <ol className="text-base space-y-2 mb-4">
            <li>1. Have early-stage investment experience, or</li>
            <li>2. Have experience as a serial entrepreneur, or</li>
            <li>3. Am a senior management professional(s) with at least ten years of
            experience.</li>
          </ol>
          <p className="text-base text-gray-600">
            For the purpose of this clause, 'early-stage investment experience'
            shall mean prior experience in investing in start-up or emerging or
            early-stage ventures and 'serial entrepreneur' shall mean a person
            who has promoted or co-promoted more than one start-up venture.
          </p>
        </div>

        <div className="flex items-start gap-3 mb-8">
          <input
            type="checkbox"
            id="agreement"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
          />
          <label htmlFor="agreement" className="text-black text-sm leading-relaxed cursor-pointer">
            I confirm that I qualify as an Angel Investor based on the above
            condition(s)
            <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!checked || loading}
        className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
          checked && !loading
            ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Sending contribution agreement" : "Agree & Continue"}
      </button>
    </div>
  );
};

export default ContributionAgreement;
