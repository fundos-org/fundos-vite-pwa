import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface VerifyEmailOtpProps {
  onNext: () => void;
  onBack: () => void;
}

const VerifyEmailOtp = ({ onNext, onBack }: VerifyEmailOtpProps) => {
  const navigate = useNavigate();
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const email = sessionStorage.getItem("email") || "";
  const userId = sessionStorage.getItem("userId") || "";

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < 5) {
        const nextInput = document.getElementById(`email-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    try {
      const { data } = await api.post(
        "/onboarding/email/otp/verify",
        {},
        {
          params: { user_id: userId, email, otp: otpValue },
        }
      );

      if (data.success) {
        toast.success("Email verified successfully!");
        localStorage.setItem("accessToken", data.tokens?.access_token);
        localStorage.setItem("refreshToken", data.tokens?.refresh_token || "");
        onNext();
      } else {
        toast.error(
          data.message || "Failed to verify OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        "Failed to verify OTP. Please check your internet connection."
      );
    }
  };

  return (
    <div className="flex-1 bg-white px-6 py-8 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="text-gray-600 text-2xl mr-4 hover:text-gray-800 transition-colors"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold text-black">
            Verify Your Email
          </h1>
        </div>
        
        <p className="text-gray-500 mb-6 text-base">
          We have sent a verification code to your email address
        </p>

        {/* Email display with edit icon */}
        <div className="flex items-center justify-center mb-8">
          <span className="text-gray-600 text-lg">{email}</span>
          <button 
            onClick={() => navigate(eRoutes.EMAIL_AUTH)}
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
            Enter 6-digit verification code
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`email-otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl border border-gray-300 bg-white text-black outline-none rounded-lg focus:border-[#4285F4] focus:ring-2 focus:ring-blue-100"
                placeholder="-"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        disabled={otp.join("").length !== 6}
        className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
          otp.join("").length === 6
            ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Verify & Continue
      </button>
    </div>
  );
};

export default VerifyEmailOtp;
