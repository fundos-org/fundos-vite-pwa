import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function TermSheet() {
    const navigate = useNavigate();
    // const { dealId, investmentAmount } = useParams<{ dealId: string; investmentAmount: string }>();

    const [userId, setUserId] = useState<string>("");
    const [investAmount, setInvestAmount] = useState<string>("");
    const [dId, setDId] = useState<string>("");
    const [sectionChecks, setSectionChecks] = useState({
        section1: false,
        section2: false,
        finalConfirmation: false,
    });

    useEffect(() => {
        // Replace with your actual user id fetch logic
        const storedUserId = sessionStorage.getItem("userId");
        const storedInvestmentAmount = sessionStorage.getItem("investmentAmount");
        const storedDealId = sessionStorage.getItem("dealId");
        if (storedUserId) setUserId(storedUserId);
        if (storedInvestmentAmount) setInvestAmount(storedInvestmentAmount);
        if (storedDealId) setDId(storedDealId);
    }, []);

    const allChecked = Object.values(sectionChecks).every(Boolean);

    const toggleCheckbox = (section: keyof typeof sectionChecks) => {
        setSectionChecks((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleClick = async () => {
        try {
            const response = await apiSendDrawDownNotice({
                user_id: userId,
                investment_amount: Number(investAmount),
                deal_id: dId ?? "",
            });
            if (!response) {
                toast.error("Failed to send docs for sign. Please try again.");
                return;
            }
            if (response?.message) {
                toast.success(response.message);
            }
            navigate(eRoutes.DRAW_DOWN_NOTICE_HOME);
        } catch  {
            // Error handled in apiSendDrawDownNotice
            toast.error("An error occurred while processing your request. Please try again.");
        }
    };

    return (
        <>
            <div className="w-full h-[70vh] flex flex-col justify-between max-w-2xl bg-white/5 border border-white/10 p-8 shadow-lg text-white">
                <div>
                <h1 className="text-3xl font-bold mb-6 text-center">Term Sheet</h1>
                <p className="text-base mb-2">Date: {new Date().toLocaleDateString()}</p>
                {/* <p className="text-base mb-2">Investor: {investorName}</p> */}
                {/* <p className="text-base mb-2">Startup: [Startup Name]</p> */}

                {/* Section 1 */}
                <div className="mt-6">
                    <div
                        className="flex items-center justify-between border-b border-gray-400 pb-2 mb-2 cursor-pointer">
                        <label htmlFor="section1" className="font-semibold text-lg">1. Investment Terms</label>
                        <input
                            type="checkbox"
                            id="section1"
                            checked={sectionChecks.section1}
                            onChange={() => toggleCheckbox("section1")}
                            className="w-5 h-5 accent-[#546881]"
                        />
                    </div>
                    <ul className="list-disc list-inside text-gray-300 ml-4">
                        <span>Investment Amt: ₹ {investAmount} /-</span>
                    </ul>
                </div>

                {/* Section 2 */}
                <div className="mt-6">
                    <div
                        className="flex items-center justify-between border-b border-gray-400 pb-2 mb-2 cursor-pointer"
                    >
                        <label htmlFor="section2" className="font-semibold text-lg">2. Closing Conditions</label>
                        <input
                            type="checkbox"
                            id="section2"
                            checked={sectionChecks.section2}
                            onChange={() => toggleCheckbox("section2")}
                            className="w-5 h-5 accent-[#546881]"
                        />
                    </div>
                    <ul className="list-disc list-inside text-gray-300 ml-4">
                        <li>Completion of satisfactory due diligence</li>
                        <li>Signing of final legal documents (Shareholder Agreement, Subscription)</li>
                        <li>Board approval (if applicable)</li>
                    </ul>
                </div>
                </div>

                {/* <p className="mt-8 text-base">Investor Name: {investorName}</p> */}

                {/* Final Confirmation */}
                <div
                    className="flex items-start gap-2 mt-6 cursor-pointer"
                >
                    <input
                        type="checkbox"
                        id='finalConfirmation'
                        checked={sectionChecks.finalConfirmation}
                        onChange={() => toggleCheckbox("finalConfirmation")}
                        className="w-5 mt-0.5 h-5 accent-[#546881]"
                    />
                    <label className="text-sm" htmlFor='finalConfirmation'>
                        I confirm that I read all the content based on the above Terms and Condition(s)
                        <span className="text-red-400">*</span>
                    </label>
            </div>
            </div>

            {/* Proceed Button */}
            <button
                onClick={handleClick}
                disabled={!allChecked}
                className="bg-green-400 text-gray-900 font-semibold px-8 py-4 w-full transition-all duration-300 hover:bg-green-500 focus:outline-none"
            >
                Proceed → 
            </button>
    </>
    );
}

export default TermSheet;

// --- API Helper ---
async function apiSendDrawDownNotice(data: {
    user_id: string;
    deal_id: string;
    investment_amount: number;
}) {
    try {
        const response = await fetch(
            `http://43.205.36.168/api/v1/live/deals/send/drawdown-notice?user_id=${data.user_id}&deal_id=${data.deal_id}&investment_amount=${data.investment_amount}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            toast.error(errorData?.message || "Unexpected error took place");
            throw new Error(errorData?.message || "Unexpected error took place");
        }
        return await response.json();
    } catch (error: unknown) {
        toast.error((error as Error)?.message || "An unexpected error occurred");
        throw new Error((error as Error)?.message || "An unexpected error occurred");
    }
}
