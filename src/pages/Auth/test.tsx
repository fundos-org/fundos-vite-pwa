import { eRoutes } from "@/RoutesEnum";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate } from "react-router-dom";

const AadhaarVerification = () => {
    const navigate = useNavigate();
    const [showProceed, setShowProceed] = useState(false);
    const [showRetry, setShowRetry] = useState(false);
    const [userId, setUserId] = useState('');
    const [aadhaarUrl, setAadhaarUrl] = useState<string | null>(null); // For modal iframe

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
                setAadhaarUrl(data.short_url); // Open modal with iframe
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

            if (data.success) {
                toast.success(data.message || 'Aadhaar verification status checked successfully');
                navigate(eRoutes.PAN_AUTH)
            } else {
                toast.error(data.message || 'Please complete your Aadhaar verification');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to check Aadhaar verification status');
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-end p-8 max-h-full overflow-y-auto">
            <h1 className="text-white text-4xl font-bold mb-2.5">
                Aadhaar KYC Verification
            </h1>
            <p className="text-teal-300 text-sm mb-8 leading-relaxed">
                Complete your Aadhaar verification to finish KYC and begin investing.
            </p>

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

            {/* Aadhaar Verification Modal */}
            {aadhaarUrl && (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[1000] h-screen w-screen text-white p-4 overflow-hidden box-border">
                    <button
                        onClick={() => setAadhaarUrl(null)}
                        className="bg-transparent border-none text-gray-400 text-2xl cursor-pointer absolute top-4 right-4 z-10"
                    >
                        ✕
                    </button>
                    <div className="flex-1 flex flex-col justify-center p-8 max-h-full overflow-y-auto w-full max-w-2xl">
                        <h2 className="text-white mb-4 text-2xl font-bold">Aadhaar Verification</h2>
                        <iframe
                            src={aadhaarUrl}
                            title="Aadhaar Verification"
                            className="w-full h-[70vh] rounded-lg border-2 border-gray-700"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AadhaarVerification;