import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";

const KycStart = () => {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <h1 className="text-white text-4xl font-bold mb-2">
                    Secure Your Investments
                </h1>

                <p className="text-[#00ffcc] text-sm mb-8 leading-relaxed">
                    We verify your identity to protect your account, ensure regulatory compliance, and give you access to exclusive deals.
                </p>
            </div>
<button onClick={() => navigate(eRoutes.AADHAAR_AUTH)}>test next</button>
            <button
                onClick={() => navigate(eRoutes.AADHAAR_AUTH)}
                className="bg-[#00fb57] text-[#1a1a1a] border-none py-4 px-8 text-base font-semibold cursor-pointer w-full transition-all duration-300 ease-in-out"
            >
                Complete KYC Now
            </button>
        </>
    );
};

export default KycStart;
