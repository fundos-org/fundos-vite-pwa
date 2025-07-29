import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BankDetails = () => {
  const navigate = useNavigate();

  // Generate random bank account number (10-12 digits to prevent overflow)
  const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 90000000000).toString();
  };

  // Generate random IFSC code (4 letters + 1 digit + 6 alphanumeric)
  const generateIFSC = () => {
    const banks = ["SBIN", "HDFC", "ICIC", "AXIS", "PUNB", "IDIB", "KKBK", "BARB"];
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    const randomDigit = Math.floor(Math.random() * 10).toString();
    const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
    }
    return `${randomBank}${randomDigit}${code}`;
  };

  // Generate random account holder name
  const generateAccountHolder = () => {
    const firstNames = ["John", "Jane", "Michael", "Sarah", "Robert", "Emily", "David", "Olivia"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  };

  // Bank data
  const bankData = {
    accountNumber: generateAccountNumber(),
    ifscCode: generateIFSC(),
    accountHolder: generateAccountHolder(),
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white overflow-hidden box-border">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 mr-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-medium">Bank details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        <div className="border border-white/10 bg-[#1A1A1A] rounded-xs p-4 mb-8 relative">
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">ACCOUNT NUMBER</p>
            <p className="text-xl font-bold tracking-wider">{bankData.accountNumber}</p>
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
        
        <button 
          className="w-full bg-white text-black font-medium py-2 rounded-xs mt-56"
          onClick={() => navigate("/add-bank-account")}
        >
          Add new bank account
        </button>
      </div>
    </div>
  );
};

export default BankDetails;
