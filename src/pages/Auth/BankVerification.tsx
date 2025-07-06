import { eRoutes } from "@/RoutesEnum";
import { ChangeEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BankDetails = () => {
    const navigate = useNavigate();
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [panNumber, setPanNumber] = useState('');

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        const storedPanNumber = sessionStorage.getItem('panNumber');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        if (storedPanNumber) {
            setPanNumber(storedPanNumber);
        }
    }, []);

    // Bank account number validation (9-18 digits, numeric only)
    const isValidAccountNumber = (accNumber: string) => {
        const accountRegex = /^[0-9]{9,18}$/;
        return accountRegex.test(accNumber);
    };

    // IFSC code validation (4 letters + 1 digit + 6 alphanumeric)
    const isValidIFSC = (ifsc: string) => {
        const ifscRegex = /^[A-Z]{4}[0-9]{1}[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc);
    };

    const handleSubmit = async () => {
        if (!isValidAccountNumber(accountNumber)) {
            toast.error('Please enter a valid bank account number (9-18 digits)');
            return;
        }
        if (!isValidIFSC(ifscCode)) {
            toast.error('Please enter a valid IFSC code (e.g., SBIN0001234)');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://api.fundos.services/api/v1/live/kyc/pan/bank/link/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    pan_number: panNumber,
                    bank_account_number: accountNumber,
                    ifsc_code: ifscCode,
                    tax_identity_number: panNumber, // Set tax identity number same as PAN
                }),
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'Bank details verified successfully');
                navigate(eRoutes.PROFESSIONAL_BACKGROUND_AUTH)
            } else {
                toast.error(data.message || 'Failed to verify bank. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Bank Verification failed');
        } finally {
            setLoading(false);
        }
    };


    const handleAccountNumberChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        setAccountNumber(value);
    };

    const handleIfscChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Allow only alphanumeric
        if (value.length <= 11) { // IFSC is 11 characters
            setIfscCode(value);
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
        <>
            <div>
                <h1 className="text-white text-4xl font-bold mb-2.5">
                    Bank Details
                </h1>
                <p className="text-[#00ffcc] text-sm mb-8 leading-relaxed">
                    Share your bank account details.
                </p>
                <div className="mb-6">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                        placeholder="Enter bank Account Number"
                        className="w-full p-4 text-base border border-[#374151] bg-[#374151] text-white outline-none"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        value={ifscCode}
                        onChange={handleIfscChange}
                        placeholder="Enter your IFSC"
                        autoCapitalize="characters"
                        autoComplete="off"
                        className="w-full p-4 text-base border border-[#374151] bg-[#374151] text-white outline-none tracking-wider"
                    />
                </div>
            </div>
            {/* <button onClick={() => navigate(eRoutes.PROFESSIONAL_BACKGROUND_AUTH)}>test next</button> */}
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={!isValidAccountNumber(accountNumber) || !isValidIFSC(ifscCode)}
                className={`w-full bg-${isValidAccountNumber(accountNumber) && isValidIFSC(ifscCode) ? '[#00fb57]' : '[#374151]'} text-${isValidAccountNumber(accountNumber) && isValidIFSC(ifscCode) ? '[#1a1a1a]' : 'gray-400'} border-none py-4 px-8 text-base font-semibold transition-all duration-300 ${isValidAccountNumber(accountNumber) && isValidIFSC(ifscCode) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
                Next
            </button>
        </>
    );
};

export default BankDetails;