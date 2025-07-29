import { useHomeContext } from "@/Shared/useLocalContextState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";
import { 
  FaUser, 
  FaMoneyBillWave, 
  FaUniversity, 
  FaBell, 
  FaFileAlt, 
  FaLock, 
  FaHeadset 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Add useNavigate import

interface UserProfile {
  full_name: string;
  email: string;
  phone_number: string;
  capital_commitment: number;
  profilePicture?: string;
}

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  section: string;
}

const ProfileTab = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { localContextState } = useHomeContext();
  const navigate = useNavigate(); // Add useNavigate import

  const navigationItems: NavItem[] = [
    { id: 'profile', title: 'my profile', icon: <FaUser />, section: 'CONNECTIONS' },
    { id: 'transactions', title: 'transactions', icon: <FaMoneyBillWave />, section: 'CONNECTIONS' },
    { id: 'bank', title: 'bank details', icon: <FaUniversity />, section: 'CONNECTIONS' },
    { id: 'notifications', title: 'manage notifications', icon: <FaBell />, section: 'CONNECTIONS' },
    { id: 'terms', title: 'terms of use', icon: <FaFileAlt />, section: 'HELP AND SUPPORT' },
    { id: 'privacy', title: 'privacy policy', icon: <FaLock />, section: 'HELP AND SUPPORT' },
    { id: 'support', title: 'customer support', icon: <FaHeadset />, section: 'HELP AND SUPPORT' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const storedUserId = localContextState.userId ?? sessionStorage.getItem('userId');
        if (!storedUserId) {
          toast.error('User ID not found. Please login again.');
          setLoading(false);
          return;
        }

        const apiUrl = `https://api.fundos.services/api/v0/test/user/details?user_id=${storedUserId}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.success) {
          throw new Error('API request failed or returned error');
        }
        
        const userData = data.data;
        if (!userData) {
          throw new Error('No user data received from API');
        }
        
        setUserProfile({
          full_name: "John Doe", // Use John Doe as requested
          email: userData.email || 'user@example.com',
          phone_number: userData.phone_number || '+91 XXXXXXXXXX',
          capital_commitment: userData.capital_commitment || 0,
          profilePicture: "/profile-image.jpg" // Will use default image from the navigation code
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data. Please try again later.');
        setUserProfile({
          full_name: "John Doe", // Use John Doe as requested
          email: 'N/A',
          phone_number: 'N/A',
          capital_commitment: 0,
          profilePicture: undefined
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNavigation = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
    if (itemId === 'profile') {
      navigate("me"); // Navigate to the new MyProfile route
    } else if (itemId === 'transactions') {
      navigate("transactions"); // Navigate to the transactions route
    } else if (itemId === 'bank') {
      navigate("bank-details"); // Navigate to bank details
    } else if (itemId === 'notifications') {
      navigate("notifications-settings"); // Navigate to notifications settings
    }
    // Other navigation logic would go here
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Random pastel background colors
  const pastelColors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-indigo-200",
    "bg-red-200",
    "bg-orange-200",
    "bg-teal-200",
  ];
  
  // Choose a color based on the user's name (deterministic)
  const getProfileColor = (name: string) => {
    // Simple hash function to get a consistent index
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return pastelColors[charSum % pastelColors.length];
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

  const profileColor = getProfileColor(userProfile?.full_name || "John Doe");
  const initials = getInitials(userProfile?.full_name || "John Doe");

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white overflow-hidden box-border">
      {/* Profile Header with gradient */}
      <div className="flex flex-col items-center py-10 bg-gradient-to-br from-[#2d0a2e] to-[#1a0a1b] border-b border-white/10">
        <div className="w-28 h-28 rounded-full mb-4 overflow-hidden border-2 border-white/20 flex items-center justify-center">
          {userProfile?.profilePicture ? (
            <img 
              src={userProfile.profilePicture}
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // On error, replace with initials
                target.style.display = 'none';
                target.parentElement?.classList.add(profileColor);
                const initialsElement = document.createElement('span');
                initialsElement.className = 'text-3xl font-bold text-gray-800';
                initialsElement.textContent = initials;
                target.parentElement?.appendChild(initialsElement);
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${profileColor}`}>
              <span className="text-3xl font-bold text-gray-800">{initials}</span>
            </div>
          )}
        </div>
        <h2 className="text-white text-xl font-medium mb-1">John Doe</h2>
        <p className="text-blue-400 text-sm">
          <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1"></span> 
          MEMBER SINCE 15TH JUNE 2023
        </p>
      </div>

      {/* Invitation Code - black background */}
      <div className="px-6 py-4 border-b border-white/10 bg-[#121212]">
        <p className="text-xs text-gray-400 mb-1">INVITATION CODE</p>
        <div className="flex items-center">
          <div className="flex-1 bg-[#242424] p-2 rounded">
            <code className="text-sm">fundos.service/eqrtysdr</code>
          </div>
          <button className="ml-2 bg-[#00fb57] text-black py-2 px-4 text-sm font-medium rounded">Invite</button>
        </div>
      </div>

      {/* Navigation Menu - black background */}
      <div className="flex-1 overflow-auto bg-[#121212] pb-24">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-400 mb-2">CONNECTIONS</p>
          
          {navigationItems.filter(item => item.section === 'CONNECTIONS').map((item) => (
            <div 
              key={item.id} 
              className="flex items-center py-3 px-2 hover:bg-[#242424] cursor-pointer"
              onClick={() => handleNavigation(item.id)}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="flex-1 text-sm">{item.title}</span>
              <FaArrowRightLong className="text-gray-400" />
            </div>
          ))}
        </div>

        <div className="px-4 py-2">
          <p className="text-xs text-gray-400 mb-2">HELP AND SUPPORT</p>
          
          {navigationItems.filter(item => item.section === 'HELP AND SUPPORT').map((item) => (
            <div 
              key={item.id} 
              className="flex items-center py-3 px-2 hover:bg-[#242424] cursor-pointer"
              onClick={() => handleNavigation(item.id)}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="flex-1 text-sm">{item.title}</span>
              <FaArrowRightLong className="text-gray-400" />
            </div>
          ))}
        </div>
        
        {/* App Version - black background */}
        <div className="text-center py-4 text-gray-400 text-xs bg-[#121212]">
          FUNDOS V1.0.6
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;