import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useHomeContext } from "@/Shared/useLocalContextState";

function TermSheet() {
    const navigate = useNavigate();
    const { localContextState } = useHomeContext();
    const { dealId, investmentAmount, userId, investorName } = localContextState;
    const [sectionChecks, setSectionChecks] = useState({
        section1: false,
        section2: false,
        finalConfirmation: false,
    });

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
                user_id: userId ?? "",
                investment_amount: Number(investmentAmount),
                deal_id: dealId ?? "",
            });
            if (!response) {
                toast.error("Failed to send docs for sign. Please try again.");
                return;
            }
            if (response?.message) {
                toast.success(response.message);
            }
            navigate(eRoutes.DRAW_DOWN_NOTICE_HOME);
        } catch {
            // Error handled in apiSendDrawDownNotice
            toast.error("An error occurred while processing your request. Please try again.");
        }
    };

    return (
        <div className="flex flex-col w-full max-w-2xl justify-between h-[calc(100vh-15vh)] bg-white/5 border border-white/10 p-7 shadow-lg text-white">
            {/* Header */}
            <div>
                <div>
                    <h1 className="text-3xl font-bold text-muted/50 mb-4 text-center">Term Sheet</h1>
                    <div className="text-base flex flex-col">
                        <span className="capitalize text-muted/40">Investor Name: </span>
                        <span className="font-semibold">{investorName}</span>
                        <br />
                        <span className="text-base text-muted/40">Date:</span>
                        <span className="font-semibold"> {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Section 1: Investment Terms */}
                <div className="mt-6">
                    <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-2">
                        <label htmlFor="section1" className="font-semibold text-lg cursor-pointer">
                            1. Investment Terms
                        </label>
                        <input
                            type="checkbox"
                            id="section1"
                            checked={sectionChecks.section1}
                            onChange={() => toggleCheckbox('section1')}
                            className="w-5 h-5 accent-[#546881] cursor-pointer"
                        />
                    </div>
                    <ul className="list-disc list-inside text-gray-300 ml-4">
                        <li>Investment Amt: ₹ {investmentAmount} /-</li>
                    </ul>
                </div>

                {/* Section 2: Closing Conditions */}
                <div className="mt-6">
                    <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-2">
                        <label htmlFor="section2" className="font-semibold text-lg cursor-pointer">
                            2. Closing Conditions
                        </label>
                        <input
                            type="checkbox"
                            id="section2"
                            checked={sectionChecks.section2}
                            onChange={() => toggleCheckbox('section2')}
                            className="w-5 h-5 accent-[#546881] cursor-pointer"
                        />
                    </div>
                    <ul className="list-disc list-inside text-gray-300 ml-4">
                        <li>Completion of satisfactory due diligence</li>
                        <li>Signing of final legal documents (Shareholder Agreement, Subscription)</li>
                        <li>Board approval (if applicable)</li>
                    </ul>
                </div>
            </div>

            {/* Final Confirmation */}
            <div className="flex flex-col">
                <div className="flex items-start gap-2 mt-6">
                    <input
                        type="checkbox"
                        id="finalConfirmation"
                        checked={sectionChecks.finalConfirmation}
                        onChange={() => toggleCheckbox('finalConfirmation')}
                        className="w-5 h-5 mt-0.5 accent-[#546881] cursor-pointer"
                    />
                    <label htmlFor="finalConfirmation" className="text-sm">
                        I confirm that I read all the content based on the above Terms and Condition(s)
                        <span className="text-red-400">*</span>
                    </label>
                </div>

                {/* Proceed Button */}
                <button
                    onClick={handleClick}
                    disabled={!allChecked}
                    className="mt-6 bg-green-400 text-gray-900 font-semibold px-8 py-4 w-full transition-all duration-300 hover:bg-green-500 focus:outline-none disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Proceed →
                </button>
            </div>
        </div>
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
            `https://api.fundos.services/api/v1/live/deals/send/drawdown-notice?user_id=${data.user_id}&deal_id=${data.deal_id}&investment_amount=${data.investment_amount}`,
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
