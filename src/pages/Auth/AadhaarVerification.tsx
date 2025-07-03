import { eRoutes } from "@/RoutesEnum";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AadhaarVerification = () => {
    const navigate = useNavigate();
    const [showProceed, setShowProceed] = useState(false);
    const [showRetry, setShowRetry] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const handleVerifyAadhaar = async () => {
        try {
            const response = await fetch(`https://api.fundos.services/api/v2/live/kyc/generate-url?user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (data.success && data.short_url) {
                // Open Aadhaar verification URL in new tab
                window.open(data.short_url, '_blank');
                setShowProceed(false);
                setShowRetry(false);
                setTimeout(() => {
                    setShowProceed(true);
                    setShowRetry(true);
                }, 5000);
            } else {
                toast.error('Failed to fetch Aadhaar redirect URL');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch Aadhaar redirect URL');
        }
    };

    const handleProceedNext = async () => {
        try {
            const response = await fetch(`https://api.fundos.services/api/v2/live/kyc/details?user_id=${userId}`, {
                method: 'GET',
            });
            const data = await response.json();
            console.log('Aadhaar verification status:', data);
            
            if (data.success) {
                toast.success(data.message || 'Aadhaar verification status checked successfully');
                navigate(eRoutes.PAN_AUTH)
            } else {
                const parsedMessage = JSON.parse(data ?? {});
                toast.error(parsedMessage.error || 'Please complete your Aadhaar verification');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to check Aadhaar verification status');
        }
    };

    return (

        <>
            <div>
            <h1 className="text-white text-4xl font-bold mb-2.5">
                Aadhaar KYC Verification
            </h1>
            <p className="text-teal-300 text-sm mb-8 leading-relaxed">
                Complete your Aadhaar verification to finish KYC and begin investing.
            </p>
            </div>

            <div>
            {!showProceed && (
                <button
                    onClick={handleVerifyAadhaar}
                    className="bg-green-400 text-gray-900 border-none py-4 px-8 text-base font-semibold cursor-pointer w-full mb-2.5 transition-all duration-300 ease-in-out"
                >
                    Verify Aadhaar Now
                </button>
            )}

            {showRetry && (
                <button
                    onClick={handleVerifyAadhaar}
                    className="bg-yellow-400 text-gray-900 border-none py-4 px-8 text-base font-semibold cursor-pointer w-full mb-2.5 transition-all duration-300 ease-in-out"
                >
                    Retry Verification
                </button>
            )}

            {showProceed && (
                <button
                    onClick={handleProceedNext}
                    className="bg-green-400 text-gray-900 border-none py-4 px-8 text-base font-semibold cursor-pointer w-full transition-all duration-300 ease-in-out"
                >
                    Proceed Next
                </button>
            )}
            </div>
        </>
    );
};

export default AadhaarVerification;