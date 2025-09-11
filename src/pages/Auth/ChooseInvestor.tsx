import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChooseInvestor = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const userId = sessionStorage.getItem("userId") || "";

  const investorOptions = [
    {
      value: "INDIVIDUAL",
      label: "Individual Investor",
      description: "I'm investing as a person using my personal capital",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      value: "ENTITY",
      label: "Entity Investor",
      description:
        "I'm investing on behalf of a company, LLP, trust, or registered fund",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
        </svg>
      ),
    },
  ];

  const handleContinue = async () => {
    if (!selectedType) {
      toast.error("Please select an investor type");
      return;
    }

    if (!isChecked) {
      toast.error("Please accept the angel investor declaration");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    try {
      // First, save the investor type
      await api.post(
        "/onboarding/onboarding/choose/investor-type",
        {},
        { params: { investor_type: selectedType } }
      );

      sessionStorage.setItem("investorType", selectedType);

      // Then, save the declaration
      await api.post(
        "/onboarding/onboarding/declaration",
        {},
        {
          params: { declaration_accepted: isChecked },
        }
      );

      sessionStorage.setItem("declarationAccepted", "true");
      toast.success("Investor type and declaration saved successfully!");
      navigate(eRoutes.PROFESSIONAL_BACKGROUND_AUTH);
    } catch (error) {
      console.error("Error saving investor type and declaration:", error);
      toast.error("Failed to save information. Please try again.");
    }
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
              onClick={() => navigate(eRoutes.PHONE_NUMBER)}
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
            <p className="text-white text-sm mb-2">Step 2 of 6</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-[#FF9635] h-2 rounded-full transition-all duration-300"
                style={{ width: "33.33%" }} // 2/6 = 33.33%
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-6 py-8 flex flex-col">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-4">
            Choose Your Investor Type
          </h1>

          <p className="text-gray-500 mb-8 text-base">
            This helps us customize your experience and show relevant investment
            options
          </p>

          {/* Investor Type Options */}
          <div className="mb-8">
            {investorOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setSelectedType(option.value)}
                className={`border border-gray-300 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                  selectedType === option.value
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black mb-1">
                      {option.label}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  </div>
                  {selectedType === option.value && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Information Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-black mb-2">
              Can I Change This Later?
            </h3>
            <p className="text-gray-600 text-sm">
              No, you can't switch between individual and entity accounts after
              successful onboarding
            </p>
          </div>

          {/* Declaration Section - Only show when an option is selected */}
          {selectedType && (
            <div className="mb-8">
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3 mt-1"
                />
                <label
                  htmlFor="declaration"
                  className="text-black text-sm leading-relaxed"
                >
                  I hereby declare that I qualified as an angel investor based
                  on the following condition(s)
                </label>
              </div>

              <div className="ml-8 text-gray-600 text-sm">
                <p className="mb-2">
                  I am an individual investor who has net tangible assets of at
                  least two crore rupees excluding value of my principal
                  residence, and:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Have Early-Stage Investment Experience, or</li>
                  <li>Have Experience As A Serial Entrepreneur, or</li>
                  <li>
                    Am a senior management professional(s) with at least 10
                    years of experience
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedType || !isChecked}
          className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
            selectedType && isChecked
              ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedType === "INDIVIDUAL"
            ? "Continue With Individual Account"
            : selectedType === "ENTITY"
            ? "Continue With Entity Account"
            : "Continue With Account"}
        </button>
      </div>
    </div>
  );
};

export default ChooseInvestor;
