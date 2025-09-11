import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { eRoutes } from "@/RoutesEnum";
import VerifyEmailOtp from "./VerifyEmailOtp";
import UserDetails from "./UserDetails";
import ContributionAgreement from "./ContributionAgreement";

const KYCStep1 = lazy(() =>
  import("./KYCStep1").catch(() => ({ default: () => <div>Loading...</div> }))
);

const KYC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(eRoutes.PROFESSIONAL_BACKGROUND_AUTH);
    }
  };

  const handleComplete = () => {
    navigate(eRoutes.UPLOAD_PHOTO_AUTH);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <KYCStep1 onNext={handleNextStep} onBack={handlePrevStep} />
          </Suspense>
        );
      case 2:
        return (
          <VerifyEmailOtp onNext={handleNextStep} onBack={handlePrevStep} />
        );
      case 3:
        return <UserDetails onNext={handleNextStep} onBack={handlePrevStep} />;
      case 4:
        return (
          <ContributionAgreement
            onNext={handleComplete}
            onBack={handlePrevStep}
          />
        );
      default:
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <KYCStep1 onNext={handleNextStep} onBack={handlePrevStep} />
          </Suspense>
        );
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
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
            {currentStep > 1 ? (
              <button onClick={handlePrevStep} className="text-white text-2xl">
                ←
              </button>
            ) : (
              <div className="w-6"></div>
            )}
            <div className="text-2xl font-bold">
              <span className="text-white">Fund</span>
              <span className="text-orange-400">OS</span>
            </div>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>

          {/* Progress indicator */}
          <div className="text-center mb-4">
            <p className="text-white text-sm mb-2">Step 4 of 6</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-[#FF9635] h-2 rounded-full transition-all duration-300"
                style={{ width: "66.67%" }} // 4/6 = 66.67%
              ></div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center items-center space-x-8 mt-6">
            {[
              { step: 1, label: "Details" },
              { step: 2, label: "Verification" },
              { step: 3, label: "Review" },
              { step: 4, label: "Declaration" },
            ].map(({ step, label }) => {
              const status = getStepStatus(step);
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      status === "completed"
                        ? "bg-green-500 text-white"
                        : status === "current"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {status === "completed" ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      status === "completed" || status === "current"
                        ? "text-white font-bold"
                        : "text-white"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white">{renderStepContent()}</div>
    </div>
  );
};

export default KYC;
