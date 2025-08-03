import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ContributionAgreement = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleContinue = async () => {
    if (!checked) {
      toast.error(
        "Please confirm that you qualify as an Angel Investor before proceeding."
      );
      return;
    }

    api
      .post(
        "/onboarding/zoho/sign-agreement",
        {},
        {
          params: {
            agreement_signed: checked,
          },
        }
      )
      .then(({ data }) => {
        if (data.success) {
          sessionStorage.setItem("agreementSigned", "true");
          toast.success("Agreement signed successfully!");
          navigate(eRoutes.UPLOAD_PHOTO_AUTH);
        } else {
          toast.error(
            data.message || "Failed to sign agreement. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error signing agreement:", error);
        toast.error("Failed to sign agreement. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div>
        <h1 className="text-white text-4xl font-medium mb-4">
          Contribution Agreement
        </h1>

        <div className="mb-8 leading-relaxed">
          <p className="text-gray-300 text-[15px] mb-3">
            I am an individual investor who has net tangible assets of at least
            two crore rupees excluding value of my principal residence, and:
          </p>
          <p className="text-gray-300 text-[15px] mb-3">
            1. Have early-stage investment experience, or
          </p>
          <p className="text-gray-300 text-[15px] mb-3">
            2. Have experience as a serial entrepreneur, or
          </p>
          <p className="text-gray-300 text-[15px] mb-3">
            3. Am a senior management professional(s) with at least ten years of
            experience.
          </p>
          <p className="text-gray-300 text-[15px] mb-3">
            For the purpose of this clause, 'early-stage investment experience'
            shall mean prior experience in investing in start-up or emerging or
            early-stage ventures and 'serial entrepreneur' shall mean a person
            who has promoted or co-promoted more than one start-up venture.
          </p>
        </div>
      </div>

      <div>
        <div
          className="flex items-center gap-3 mb-8 cursor-pointer"
          onClick={() => setChecked(!checked)}
        >
          <div
            className={`w-5 h-5 min-w-[20px] min-h-[20px] border-2 flex items-start justify-start rounded-full flex-shrink-0 ${
              checked
                ? "border-[#00fb57] bg-[#00fb57]"
                : "border-gray-400 bg-transparent"
            }`}
          >
            {checked && <span className="text-white text-xs px-0.5">✓</span>}
          </div>
          <label className="text-white text-sm leading-5 cursor-pointer">
            I confirm that I qualify as an Angel Investor based on the above
            condition(s)
            <span className="text-xs">*</span>
          </label>
        </div>

        <button
          onClick={handleContinue}
          disabled={!checked}
          className={`w-full py-4 px-8 text-base font-semibold transition-all duration-300
        ${
          checked
            ? "bg-[#00fb57] text-[#1a1a1a] cursor-pointer"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
        >
          Agree and Continue
        </button>
      </div>
    </div>
  );
};

export default ContributionAgreement;
