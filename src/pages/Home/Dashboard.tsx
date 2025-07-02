import { useEffect, useState } from "react";
import Home from "./Home";
import toast from "react-hot-toast";
import Profile from "./Profile";
import Portfolio from "./Portfolio";
import BottomNavigation from "./BottomNavigation";
import Updates from "./Updates";

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

const Dashboard = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [investorName, setInvestorName] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Prevent multiple API calls
    if (hasLoaded) return;

    const fetchDeals = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        toast.error('User ID not found. Please login again.');
        setHasLoaded(true);
        return;
      }
      
    //   setUserId(storedUserId);
      setLoading(true);

      try {
        console.log('Fetching deals for user:', storedUserId);
        const response = await fetch(`https://api.fundos.services/api/v1/live/deals/user-deals?user_id=${storedUserId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`http error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success || data.interested_deals_data) {
          setDeals(data.interested_deals_data || []);
          setInvestorName(data.user_name || '');
          toast.success('Dashboard loaded successfully');
        } else {
          // Show deals as empty but don't show error if API response is valid
          setDeals([]);
          setInvestorName(data.user_name || 'User');
          console.log('No deals available or API returned no deals');
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Set some sample data for demo purposes when API fails
        setDeals([]);
        setInvestorName('User');
        toast('Welcome to FundOS Dashboard', { icon: '🟢' });
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    };

    fetchDeals();
  }, [hasLoaded]);

  const handleTabChange = (tabLabel: string) => {
    setActiveTab(tabLabel);
    // For now, just show notification for non-home tabs
    // if (tabLabel !== 'home') {
    //   toast(`${tabLabel.charAt(0).toUpperCase() + tabLabel.slice(1)} section coming soon!`);
    // }
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home investorName={investorName} deals={deals} />
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