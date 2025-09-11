import api from "@/lib/axiosInstance";
import { useState } from "react";
import toast from "react-hot-toast";

interface KYCStep1Props {
  onNext: () => void;
  onBack: () => void;
}

const KYCStep1 = ({ onNext, onBack: _onBack }: KYCStep1Props) => {
  const [formData, setFormData] = useState({
    email: "",
    panNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Form validation
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!formData.panNumber.trim()) {
      toast.error("Please enter your PAN card number");
      return;
    }

    // Basic email validation
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Basic PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber.toUpperCase())) {
      toast.error("Please enter a valid PAN card number");
      return;
    }

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      toast.error("User ID not found. Please try again.");
      return;
    }

    try {
      // Send OTP to email
      const { data } = await api.post(
        "/onboarding/email/otp/send",
        {},
        {
          params: { email: formData.email },
        }
      );

      if (data.success) {
        // Save email and PAN in session storage
        sessionStorage.setItem("email", formData.email);
        sessionStorage.setItem("panNumber", formData.panNumber);
        
        toast.success("OTP sent to your email successfully!");
        onNext();
      } else {
        toast.error(
          data.message || "Failed to send OTP to email. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(
        "Failed to send OTP. Please check your internet connection."
      );
    }
  };

  return (
    <div className="flex-1 bg-white px-6 py-8 flex flex-col gap-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-black mb-4">KYC</h1>

        <p className="text-gray-500 mb-8 text-base">
          Enter your email and PAN card number to start verification
        </p>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Email Address */}
          <div>
            <label className="block text-black font-medium mb-2 text-base">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-black outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PAN Card Number */}
          <div>
            <label className="block text-black font-medium mb-2 text-base">
              PAN Card Number
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) =>
                handleInputChange("panNumber", e.target.value.toUpperCase())
              }
              placeholder="ABCD1234F"
              maxLength={10}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-black outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-8">
          <h3 className="font-bold text-black mb-2">
            Why We Need This Information:
          </h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• PAN is mandatory for all investment transactions in India</li>
            <li>• Email verification ensures secure communication</li>
            <li>• Required for regulatory compliance and account verification</li>
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        disabled={!isValidEmail(formData.email) || !formData.panNumber.trim()}
        className={`w-full py-4 px-8 text-base font-semibold rounded-lg transition-all duration-300 ${
          isValidEmail(formData.email) && formData.panNumber.trim()
            ? "bg-[#4285F4] text-white cursor-pointer hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Send OTP & Continue
      </button>
    </div>
  );
};

export default KYCStep1;
