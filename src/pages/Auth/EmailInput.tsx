import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailInput = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      toast.error("User ID not found. Please try again.");
      return;
    }

    api
      .post(
        "/onboarding/email/otp/send",
        {},
        {
          params: { email },
        }
      )
      .then(({ data }) => {
        if (data.success) {
          sessionStorage.setItem("email", email);
          navigate(eRoutes.EMAIL_VERIFY_AUTH);
        } else {
          toast.error(
            data.message || "Failed to send OTP to email. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        toast.error(
          "Failed to send OTP. Please check your internet connection."
        );
      });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="mb-2 text-4xl font-bold">Enter your e-mail address.</h1>
      <p className="text-[#00ffcc] mb-8 leading-relaxed text-sm">
        Make sure it's the one you check regularly.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-4 text-base border border-gray-700 bg-gray-700 text-white"
      />
      {/* <button onClick={() => navigate(eRoutes.EMAIL_VERIFY_AUTH)}>test next</button> */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!isValidEmail(email)}
        className={`w-full py-4 mt-4 text-base font-semibold border-none transition-all duration-300 ${
          isValidEmail(email)
            ? "bg-[#00fb57] text-[#1a1a1a] cursor-pointer"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default EmailInput;
