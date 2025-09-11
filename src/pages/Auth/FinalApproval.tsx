import { eRoutes } from "@/RoutesEnum";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import portfolioService from "@/lib/portfolioService";

const FinalApproval = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = async () => {
    toast.success("KYC process completed successfully!");
    
    // Refresh portfolio data after onboarding completion
    await portfolioService.updatePortfolioData();
    
    // Add small delay to ensure notification shows before navigation
    setTimeout(() => {
      navigate(eRoutes.DASHBOARD_HOME);
    }, 100);
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
            <button onClick={() => navigate(-1)} className="text-white text-2xl">
              ←
            </button>
            <div className="text-2xl font-bold">
              <span className="text-white">Fund</span>
              <span className="text-orange-400">OS</span>
            </div>
            <div className="w-6"></div>
          </div>

          {/* Progress indicator */}
          <div className="text-center mb-4">
            <p className="text-white text-sm mb-2">Step 6 of 6</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-[#FF9635] h-2 rounded-full transition-all duration-300"
                style={{ width: "100%" }} // 6/6 = 100%
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-6 py-8 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Party popper emoji */}
          <div className="text-6xl mb-6">🎉</div>
          
          <h1 className="text-3xl font-bold text-black mb-6 text-center">
            Final Approval
          </h1>
          
          <p className="text-gray-600 text-base mb-4 leading-relaxed text-center max-w-md">
            Congratulations! Your KYC process has been submitted for final approval. You will be notified once it's approved.
          </p>
          
          <p className="text-gray-500 text-sm mb-8 leading-relaxed text-center max-w-md">
            Our team will review your application and get back to you within the next 30 minutes.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoToDashboard}
          className="w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FinalApproval;
