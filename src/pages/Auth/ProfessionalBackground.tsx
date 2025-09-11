import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfessionalBackground = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    occupation: "",
    income_source: "",
    annual_income: "",
    capital_commitment: "",
  });

  const options = {
    occupation: [
      { label: "Founder", value: "founder" },
      { label: "Employee", value: "employee" },
      { label: "Self Employed", value: "self_employed" },
      { label: "Other", value: "other" },
    ],
    income_source: [
      { label: "Business", value: "business" },
      { label: "Salary", value: "salary" },
      { label: "Investments", value: "investments" },
      { label: "Other", value: "other" },
    ],
    annual_income: [
      { label: "25L - 50L", value: "2500000" },
      { label: "50L - 1Cr", value: "5000000" },
      { label: "1Cr - 5Cr", value: "10000000" },
      { label: ">5Cr", value: "50000000" },
    ],
    capital_commitment: [
      { label: "25L - 50L", value: "2500000" },
      { label: "50L - 1Cr", value: "5000000" },
      { label: "1Cr - 5Cr", value: "10000000" },
      { label: ">5Cr", value: "50000000" },
    ],
  };

  const handleOptionSelect = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (
      !formData.occupation ||
      !formData.income_source ||
      !formData.annual_income ||
      !formData.capital_commitment
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await api.post("/onboarding/onboarding/professional-background", {
        occupation: formData.occupation,
        income_source: formData.income_source,
        annual_income: parseInt(formData.annual_income),
        capital_commitment: parseInt(formData.capital_commitment),
      });

      sessionStorage.setItem(
        "professionalBackground",
        JSON.stringify(formData)
      );
      toast.success(
        data.message || "Professional background submitted successfully!"
      );
      navigate(eRoutes.KYC_AUTH);
    } catch (error: any) {
      console.error("Error submitting professional background:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit professional background. Please try again."
      );
    }
  };

  const renderOptionGrid = (field: keyof typeof formData, label: string) => {
    return (
      <div className="mb-8">
        <label className="block text-black font-medium mb-4 text-base">
          {label}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {options[field].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionSelect(field, option.value)}
              className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 ${
                formData[field] === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full min-h-screen">
      {/* Header section with blue background */}
      <div className="relative bg-[#4285F4] text-white px-6 py-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          ></div>
          {/* Scattered dots */}
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Header content */}
        <div className="relative z-10">
          {/* Back arrow and logo */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(eRoutes.CHOOSE_INVESTOR_AUTH)}
              className="text-white text-2xl"
            >
              ←
            </button>
            <div className="text-2xl font-bold">
              <span className="text-white">Fund</span>
              <span className="text-orange-400">OS</span>
            </div>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>

          {/* Progress indicator */}
          <div className="text-center mb-4">
            <p className="text-white text-sm mb-2">Step 3 of 6</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-[#FF9635] h-2 rounded-full transition-all duration-300"
                style={{ width: "50%" }} // 3/6 = 50%
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-6 py-8 flex flex-col">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-4">
            Professional Background
          </h1>

          <p className="text-gray-500 mb-8 text-base">
            Share your Occupation details to help us better understand your background
          </p>

          {/* Form Sections */}
          {renderOptionGrid("occupation", "Occupation")}
          {renderOptionGrid("income_source", "Income Source")}
          {renderOptionGrid("annual_income", "Annual Income")}
          {renderOptionGrid("capital_commitment", "Capital Commitment (Over 5 Years)")}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={
            !formData.occupation ||
            !formData.income_source ||
            !formData.annual_income ||
            !formData.capital_commitment
          }
          className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
            formData.occupation &&
            formData.income_source &&
            formData.annual_income &&
            formData.capital_commitment
              ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProfessionalBackground;
