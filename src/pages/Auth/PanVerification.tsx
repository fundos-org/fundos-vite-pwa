import api from "@/lib/axiosInstance";
import { eRoutes } from "@/RoutesEnum";
import { ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PanVerification = () => {
  const navigate = useNavigate();
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);

  // PAN format validation: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
  const isValidPAN = (panNumber: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
  };

  const handleSubmit = async () => {
    if (!isValidPAN(pan)) {
      toast.error("Please enter a valid PAN number (e.g., ABCDE1234F)");
      return;
    }

    setLoading(true);

    api
      .post("/onboarding/onboarding/start", {
        pan_number: pan,
      })
      .then(({ data }) => {
        if (data.success) {
          sessionStorage.setItem("panNumber", pan);
          navigate(eRoutes.PROFESSIONAL_BACKGROUND_AUTH);
          toast.success("PAN verified successfully!.");
        } else {
          toast.error(
            data.message || "Failed to start onboarding. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error starting onboarding:", error);
        
        // Extract specific error message from API response
        let errorMessage = "Failed to start onboarding. Please try again.";
        
        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;
          
          // Check for specific error cases
          if (detail.includes("PAN number already attached to an investor account")) {
            errorMessage = "PAN number is already attached to an investor account";
          } else if (detail.includes("No record found for the given input")) {
            errorMessage = "No record found for the PAN card provided";
          } else {
            // Use the full detail message if it's a different error
            errorMessage = detail;
          }
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePanChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 10) {
      setPan(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#374151] border-t-[#00fb57] rounded-full animate-spin mx-auto mb-5"></div>
          <h2 className="text-3xl font-medium text-[#FDFDFD]">
            Please wait...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div>
        <h1 className="text-white text-4xl font-bold mb-2.5">
          Enter Your PAN Card
        </h1>
        <p className="text-[#00ffcc] text-sm mb-8 leading-relaxed">
          We'll use this to verify your identity and comply with regulations.
        </p>
        <div className="mb-6">
          <input
            type="text"
            value={pan}
            onChange={handlePanChange}
            placeholder="Enter PAN (e.g. ABCDE1234F)"
            autoCapitalize="characters"
            autoComplete="off"
            className="w-full p-4 text-base border border-[#374151] bg-[#374151] text-white outline-none uppercase tracking-wider"
          />
        </div>
      </div>
      {/* <button onClick={() => navigate(eRoutes.BANK_AUTH)}>test next</button> */}
      <button
        onClick={handleSubmit}
        type="submit"
        disabled={!isValidPAN(pan)}
        className={`w-full bg-[#00fb57] text-[#1a1a1a] border-none p-4 text-base font-semibold transition-all duration-300
          ${
            !isValidPAN(pan)
              ? "bg-[#374151] text-gray-400 cursor-not-allowed"
              : "cursor-pointer"
          }
        `}
      >
        Next
      </button>
    </div>
  );
};

export default PanVerification;
