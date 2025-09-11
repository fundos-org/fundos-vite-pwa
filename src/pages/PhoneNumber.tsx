import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PhoneNumber: FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const handleSubmit = async () => {
    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    api
      .get("/onboarding/phone/otp/send", {
        params: {
          phone_number: phoneNumber,
          invite_code: invitationCode,
        },
      })
      .then(({ data }) => {
        if (data.success) {
          sessionStorage.setItem("phoneNumber", phoneNumber);
          sessionStorage.setItem("invitationCode", invitationCode);

          if (data.user_id) {
            sessionStorage.setItem("userId", data.user_id);
          }

          navigate(eRoutes.VERIFY_PHONE_OTP);
        } else {
          toast.error(data.message || "Failed to send OTP. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.");
      });
  };

  const handlePhoneNumberChange = (e: string) => {
    const value = e.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
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
              onClick={() => navigate(eRoutes.GET_STARTED)}
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
            <p className="text-white text-sm mb-2">Step 1 of 6</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-[#FF9635] h-2 rounded-full transition-all duration-300"
                style={{ width: '16.67%' }} // 1/6 = 16.67%
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white px-6 py-8 flex flex-col">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black mb-4">
            Let's Verify Your Contact Info
          </h1>
          
          <p className="text-gray-600 mb-8 text-base">
            We'll send a quick verification code to keep your account secure
          </p>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label className="block mb-2 text-black text-sm font-medium">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center px-4 py-4 border-r border-gray-300 bg-gray-50">
                <span className="text-gray-700 text-base">+91</span>
                <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                placeholder="Enter phone number"
                maxLength={10}
                className="flex-1 px-4 py-4 text-base border-none bg-white text-black outline-none"
              />
            </div>
          </div>

          {/* Invitation Code Input */}
          <div className="mb-6">
            <label className="block mb-2 text-black text-sm font-medium">
              Invitation Code (Optional)
            </label>
            <input
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              placeholder="Enter invitation code"
              className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg bg-white text-black outline-none focus:border-[#4285F4]"
            />
          </div>

          {/* Why We Need This Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-black mb-2">Why We Need This</h3>
            <p className="text-gray-700 text-sm">
              For account security, transaction alerts, and regulatory compliance. We'll never spam or share your details.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={phoneNumber.length !== 10}
          className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
            phoneNumber.length === 10
              ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Send Verification Code
        </button>
      </div>
    </div>
  );
};

export default PhoneNumber;
