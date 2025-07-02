import { eRoutes } from "@/RoutesEnum";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FinalApproval = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        toast.success('KYC process completed successfully!');
        // Add small delay to ensure notification shows before navigation
        setTimeout(() => {
            navigate(eRoutes.DASHBOARD_APP);
        }, 100);
    };

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="text-7xl mb-4">🎉</div>
                <h1 className="text-white text-4xl font-bold mb-4">
                    Final Approval
                </h1>
                <p className="text-teal-300 text-base mb-8 leading-relaxed text-center">
                    Congratulations! Your KYC process has been submitted for final approval. You will be notified once it's approved.
                </p>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed text-center">
                    Our team will review your application and get back to you within 2-3 business days.
                </p>
            </div>

            <button
                onClick={handleGoToDashboard}
                className="bg-green-400 text-gray-900 font-semibold px-8 py-4 w-full max-w-xs transition-all duration-300 hover:bg-green-500 focus:outline-none"
            >
                Go to Dashboard
            </button>
        </>
    );
};

export default FinalApproval;