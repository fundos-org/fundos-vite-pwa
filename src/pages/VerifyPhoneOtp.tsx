import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import portfolioService from "@/lib/portfolioService";

const VerifyPhoneOTP: FC = () => {
  const navigate = useNavigate();
  const [otp, setOTP] = useState(["", "", "", ""]);
  const phoneNumber = sessionStorage.getItem("phoneNumber") || "";
  const invitationCode = sessionStorage.getItem("invitationCode") || "";

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < 3) {
        const nextInput = document.getElementById(`phone-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`phone-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      toast.error("Please enter complete 4-digit OTP");
      return;
    }

    api
      .get("/onboarding/phone/otp/verify", {
        params: {
          phone_number: phoneNumber,
          otp: otpValue,
          invite_code: invitationCode,
        },
      })
      .then(async ({ data }) => {
        if (data.success) {
          sessionStorage.setItem("userId", data.user_id);
          sessionStorage.setItem("subAdminId", data.subadmin_ids?.[0] || "");
          
          // Store additional data from API response
          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token || "");
          localStorage.setItem("userId", data.user_id);
          localStorage.setItem("name", data.user_name);
          localStorage.setItem("investmentAmount", data.investment_amount.toString());
          
          // Store invitation codes (take the first one if multiple)
          if (data.invitation_codes && data.invitation_codes.length > 0) {
            localStorage.setItem("invitationCode", data.invitation_codes[0]);
          }

          // Check if onboarding is completed - redirect to dashboard
          const completedStatuses = [
            "KYC_INITIATED", 
            "CKYC_COMPLETED", 
            "KYC_COMPLETED", 
            "MCA_SENT", 
            "MCA_SIGNED_USER", 
            "MCA_SIGNED_FUNDMANAGER", 
            "MCA_SIGNED_TRUSTEE", 
            "ONBOARDING_COMPLETED"
          ];
          
          if (completedStatuses.includes(data.onboarding_status)) {
            toast.success("Welcome back! Redirecting to dashboard...");
            
            // Refresh portfolio data after successful login
            await portfolioService.updatePortfolioData();
            
            navigate(eRoutes.DASHBOARD_HOME);
          } else {
            navigate(eRoutes.CHOOSE_INVESTOR_AUTH);
          }
        } else {
          toast.error(
            data.message || "Failed to verify OTP. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        toast.error(
          "Failed to verify OTP. Please try again."
        );
      });
  };

  return (
    <div className="flex flex-col h-full w-full min-h-screen">
      {/* Header section with blue background */}
      <div className="relative bg-[#4285F4] text-white px-6 py-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
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
                style={{ width: '16.66%' }} // 1/6 = 16.66%
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-6 py-8 flex flex-col">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-4">
            Check Your Phone
          </h1>
          
          <p className="text-gray-500 mb-6 text-base">
            We have sent a verification code to your number
          </p>

          {/* Phone number display with edit icon */}
          <div className="flex items-center justify-center mb-8">
            <span className="text-gray-600 text-lg">+91 {phoneNumber}</span>
            <button 
              onClick={() => navigate(eRoutes.PHONE_NUMBER)}
              className="ml-2 text-blue-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <label className="block mb-4 text-gray-500 text-sm">
              Enter 4-digit verification code
            </label>
            <div className="flex gap-4 justify-center">
              {otp.map(
                (
                  digit: string | number | readonly string[] | undefined,
                  index: number
                ) => (
                  <input
                    key={index}
                    id={`phone-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className="w-16 h-16 text-center text-xl border border-gray-300 bg-white text-black outline-none rounded-lg focus:border-[#4285F4] focus:ring-2 focus:ring-blue-100"
                    placeholder="-"
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={otp.join("").length !== 4}
          onClick={handleSubmit}
          className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
            otp.join("").length === 4
              ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );
};

export default VerifyPhoneOTP;
