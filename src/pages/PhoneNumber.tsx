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
      <div className="flex flex-col items-center justify-center h-full w-full p-4">
        <div>
          <h1 className="mb-4 text-4xl font-bold">Enter phone number</h1>

          <p className="text-[#00ffcc] mb-8 leading-relaxed text-sm">
            Your number helps us verify your identity and keep your account
            secure.
          </p>
          <div className="mb-6">
            <label className="block mb-2 text-gray-200 text-sm">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-700 bg-gray-700 overflow-hidden">
              <span className="text-white px-4 py-4 text-base border-r border-gray-500">
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                placeholder="Enter 10-digit number linked to PAN"
                maxLength={10}
                className="flex-1 px-4 py-4 text-base border-none bg-transparent text-white outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-200 text-sm">
              Invitation Code (optional)
            </label>
            <input
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              placeholder="Enter invitation code"
              className="w-full px-4 py-4 text-base border border-gray-700 bg-gray-700 text-white"
            />
          </div>
        </div>
        {/* <button onClick={() => navigate(eRoutes.VERIFY_PHONE_OTP)}>test next</button> */}

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={phoneNumber.length !== 10}
          className={`w-full py-4 px-8 text-base font-semibold border-none transition-all duration-300 ${
            phoneNumber.length === 10
              ? "bg-[#00fb57] text-[#1a1a1a] cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed
        </button>
      </div>
  );
};

export default PhoneNumber;
