import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useHomeContext } from "@/Shared/useLocalContextState";
import toast from "react-hot-toast";
import api from "@/lib/axiosInstance";

interface BankDetailsData {
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
}

interface InvestorResponse {
  investor_id: string;
  personal_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    pan_number: string;
    aadhaar_number: string;
  };
  bank_details: {
    bank_account_number: string;
    bank_ifsc: string;
    account_holder_name: string;
  };
  professional_background: {
    occupation: string;
    income_source: string;
    annual_income: number;
    capital_commitment: number;
  };
  success: boolean;
}

const BankDetails = () => {
  const navigate = useNavigate();
  const { localContextState } = useHomeContext();
  const [loading, setLoading] = useState(true);
  const [apiCalled, setApiCalled] = useState(false);
  const [bankData, setBankData] = useState<BankDetailsData>({
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
  });

  // Generate random bank details as fallback
  const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 90000000000).toString();
  };

  const generateIFSC = () => {
    const banks = [
      "SBIN",
      "HDFC",
      "ICIC",
      "AXIS",
      "PUNB",
      "IDIB",
      "KKBK",
      "BARB",
    ];
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    const randomDigit = Math.floor(Math.random() * 10).toString();
    const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += alphaNumeric.charAt(
        Math.floor(Math.random() * alphaNumeric.length)
      );
    }
    return `${randomBank}${randomDigit}${code}`;
  };

  const generateAccountHolder = () => {
    const firstNames = [
      "John",
      "Jane",
      "Michael",
      "Sarah",
      "Robert",
      "Emily",
      "David",
      "Olivia",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Miller",
      "Davis",
      "Garcia",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      // Return early if the API has already been called
      if (apiCalled) return;

      try {
        setLoading(true);
        const storedUserId =
          localContextState.userId ?? sessionStorage.getItem("userId");
        if (!storedUserId) {
          toast.error("User ID not found. Please login again.");
          setLoading(false);
          return;
        }

        setApiCalled(true); // Mark API as called to prevent duplicate requests
        const apiUrl = `/subadmin/investors/about_info`;

        const response = await api.get(apiUrl, {
          params: { investor_id: storedUserId },
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: InvestorResponse = await response.data;

        if (!data || !data.success) {
          throw new Error("API request failed or returned error");
        }

        setBankData({
          accountNumber: data.bank_details.bank_account_number,
          ifscCode: data.bank_details.bank_ifsc,
          accountHolder: data.bank_details.account_holder_name,
        });
      } catch (error) {
        console.error("Error fetching bank details:", error);
        toast.error("Failed to load bank details. Showing example data.");

        setBankData({
          accountNumber: generateAccountNumber(),
          ifscCode: generateIFSC(),
          accountHolder: generateAccountHolder(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div className="inset-0 bg-black flex flex-col text-white overflow-hidden box-border">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="p-2 mr-4">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-medium">Bank details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-[#00fb57] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="border border-white/10 bg-[#1A1A1A] rounded-xs p-4 mb-8 relative">
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">ACCOUNT NUMBER</p>
                <p className="text-xl font-bold tracking-wider">
                  {bankData.accountNumber}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">IFSC CODE</p>
                <p className="text-xl font-bold">{bankData.ifscCode}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">ACCOUNT HOLDER</p>
                <p className="text-xl font-bold">{bankData.accountHolder}</p>
              </div>
            </div>

            {/* <button
              className="w-full bg-white text-black font-medium py-2 rounded-xs mt-56"
              onClick={() => navigate("/add-bank-account")}
            >
              Add new bank account
            </button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default BankDetails;
