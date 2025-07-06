import { useEffect, useState } from "react";
import Home from "./Home";
import toast from "react-hot-toast";
import Profile from "./Profile";
import Portfolio from "./Portfolio";
import BottomNavigation from "./BottomNavigation";
import Updates from "./Updates";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const { setLocalContextState } = useHomeContext();

    useEffect(() => {
            const storedUserId = sessionStorage.getItem('userId');
            const storedSubAdminId = sessionStorage.getItem('subAdminId');
            setLocalContextState((prev) => ({
                ...prev,
                userId: storedUserId ?? '',
                subAdminId: storedSubAdminId ?? '',
            }));
            if (!storedUserId) {
                toast.error(
                    (t) => (
                        <span>
                            User ID not found. Please login again.
                            <button
                                onClick={() => {
                                    navigate(eRoutes.PHONE_NUMBER)
                                    toast.dismiss(t.id);
                                }}
                                style={{
                                    marginLeft: '10px',
                                    color: '#fff',
                                    background: '#007bff',
                                    border: 'none',
                                    padding: '4px 10px',
                                    cursor: 'pointer'
                                }}
                            >
                                Go to Login
                            </button>
                        </span>
                    ),
                    { duration: 8000 }
                );
                return;
            }
    }, [navigate, setLocalContextState]);

    const handleTabChange = (tabLabel: string) => {
        setActiveTab(tabLabel);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <Home />
                );
            case 'portfolio':
                return (
                    <Portfolio />
                );
            case 'updates':
                return (
                    <Updates />
                );
            case 'profile':
                return <Profile />;
            default:
                return null;
        }
    };

    return (
        <>
            {renderTabContent()}
            <BottomNavigation activeTab={activeTab} handleTabChange={handleTabChange} />
        </>
    );
};

export default Dashboard;