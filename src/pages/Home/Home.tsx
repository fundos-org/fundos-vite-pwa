import { eRoutes } from "@/RoutesEnum";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Deal {
    deal_id: string;
    description: string;
    title: string;
    current_valuation: number;
    round_size: number;
    commitment: number;
    logo_url: string;
    minimum_investment: number;
    deal_status: 'open' | 'closed' | 'on_hold';
}

const Home = () => {

    const [deals, setDeals] = useState<Deal[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    const { localContextState, setLocalContextState } = useHomeContext();

    useEffect(() => {
    if (hasLoaded || !localContextState.userId) return; // <-- Only run if userId exists

    const fetchDeals = async () => {
        try {
            const response = await fetch(`https://api.fundos.services/api/v1/live/deals/user-deals?user_id=${localContextState.userId}`);

            if (!response.ok) {
                throw new Error(`http error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success || data.interested_deals_data) {
                setDeals(data.interested_deals_data || []);
                setLocalContextState((prev) => ({
                    ...prev,
                    investorName: data.user_name || '',
                }));
                toast.success('Dashboard loaded successfully');
            } else {
                setDeals([]);
                setLocalContextState((prev) => ({
                    ...prev,
                    investorName: data.user_name || 'User',
                }));
            }
        } catch (error) {
            console.error('Error fetching deals:', error);
            setDeals([]);
            toast('Welcome to FundOS Dashboard', { icon: '🟢' });
            setLoading(false);
        } finally {
            setLoading(false);
            setHasLoaded(true);
        }
    }
    fetchDeals();
}, [setLocalContextState, hasLoaded, localContextState.userId]);

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('phoneNumber');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('investorType');
        sessionStorage.removeItem('panNumber');
        toast.success('Logged out successfully');
        navigate(eRoutes.PHONE_NUMBER);
    };

    const goInsideDeal = (dealId: string) => {
        setLocalContextState(prev => ({
            ...prev,
            dealId: dealId,
        }));
        navigate(eRoutes.DEAL_DETAILS_HOME);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
                <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 backdrop-blur text-center">
                    <div className="w-15 h-15 border-4 border-gray-700 border-t-[#00fb57] rounded-full animate-spin mx-auto mb-5"></div>
                    <h2 className="text-2xl font-medium text-[#FDFDFD] mb-2">
                        Loading Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 m-0">
                        Please wait while we load your investment data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white overflow-hidden box-border">
            {/* Scrollable Content */}
            <div className="flex-1 p-8 overflow-auto pb-24">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-white text-2xl font-bold m-0"><span className="mx-2 align-text-bottom">🏠</span> Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-700 text-white text-sm font-semibold px-3 py-2 cursor-pointer border-none"
                    >
                        Logout
                    </button>
                </div>

                {/* Greeting */}
                <div className="mb-8">
                    <h2 className="text-[#00fb57] text-xl font-semibold mb-2 m-0">
                        Hey {localContextState.investorName}! 👋
                    </h2>
                    <p className="text-gray-400 text-sm m-0 leading-relaxed">
                        Welcome to your investment dashboard. Your KYC is complete and you're ready to explore deals!
                    </p>
                </div>

                {/* Deals Section */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-white text-lg font-semibold mb-4 m-0">
                        Available Deals
                    </h3>
                    {deals.length > 0 ? (
                        <div className="flex-1 overflow-y-auto pb-4">
                            {deals.map((deal) => (
                                <div
                                    key={deal.deal_id}
                                    className="bg-white/10 p-6 mb-4 border border-white/15 shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-white text-base font-semibold m-0 flex-1">
                                            {deal.title}
                                        </h4>
                                        <span
                                            className={`
                                            ${deal.deal_status === 'open' ? 'bg-[#00fb57]' : ''}
                                            ${deal.deal_status === 'closed' ? 'bg-[#fd8888]' : ''}
                                            ${deal.deal_status === 'on_hold' ? 'bg-[#ffb800]' : ''}
                                            text-black text-xs font-semibold px-2 py-1 ml-2
                                        `}
                                        >
                                            {deal.deal_status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs m-0 mb-4 leading-snug">
                                        {deal.description.length > 100
                                            ? deal.description.substring(0, 100) + '...'
                                            : deal.description}
                                    </p>

                                    {/* Deal Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-[#00fb571a] p-2.5 border border-[#00fb5733]">
                                            <p className="text-[#00fb57] text-[10px] m-0 mb-1 font-semibold uppercase">
                                                Round Size
                                            </p>
                                            <p className="text-white text-sm font-bold m-0">
                                                ₹{(deal.round_size / 10000000).toFixed(1)}Cr
                                            </p>
                                        </div>
                                        <div className="bg-white/10 p-2.5 border border-white/10">
                                            <p className="text-gray-400 text-[10px] m-0 mb-1 font-semibold uppercase">
                                                Min. Investment
                                            </p>
                                            <p className="text-white text-sm font-bold m-0">
                                                ₹{(deal.minimum_investment / 10000000).toFixed(2)}Cr
                                            </p>
                                        </div>
                                    </div>

                                    {/* Funding Progress */}
                                    {/* <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <p className="text-[#00fb57] text-xs m-0 font-semibold">
                                            🎯 Funding Progress
                                        </p>
                                        <p className="text-white text-xs m-0 font-semibold">
                                            {Math.floor(Math.random() * 40 + 10)}%
                                        </p>
                                    </div>
                                    <div className="h-1.5 bg-white/10 overflow-hidden border border-white/10">
                                        <div
                                            className="h-full transition-all duration-800"
                                            style={{
                                                background:
                                                    'linear-gradient(90deg, #00fb57 0%, #00d647 100%)',
                                                width: `${Math.floor(Math.random() * 40 + 10)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div> */}

                                    <button
                                        onClick={() => goInsideDeal(deal.deal_id)}
                                        className="bg-gradient-to-br from-[#00fb57] to-[#00d647] text-[#1a1a1a] border-none px-4 py-2 text-xs font-semibold cursor-pointer w-full transition-all duration-300"
                                    >
                                        📊 View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/10 p-8 text-center border border-white/10">
                            <div className="text-5xl mb-4">💼</div>
                            <h4 className="text-white text-base font-semibold mb-2 m-0">
                                No Deals Available
                            </h4>
                            <p className="text-gray-400 text-sm m-0 leading-relaxed">
                                We're currently preparing exciting investment opportunities for you. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home