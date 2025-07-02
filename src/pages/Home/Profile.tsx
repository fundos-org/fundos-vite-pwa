import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserProfile {
  full_name: string;
  email: string;
  phone_number: string;
  capital_commitment: number;
  profilePicture?: string;
}

const ProfileTab = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          toast.error('User ID not found. Please login again.');
          setLoading(false);
          return;
        }

        console.log('Fetching user profile for ID:', storedUserId);
        const apiUrl = `https://api.fundos.services/api/v0/test/user/details?user_id=${storedUserId}`;
        console.log('API URL:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        // More flexible data validation
        if (!data || !data.success) {
          throw new Error('API request failed or returned error');
        }
        
        const userData = data.data;
        if (!userData) {
          throw new Error('No user data received from API');
        }
        
        setUserProfile({
          full_name: userData.full_name || 'User Name',
          email: userData.email || 'user@example.com',
          phone_number: userData.phone_number || '+91 XXXXXXXXXX',
          capital_commitment: userData.capital_commitment || 0,
          profilePicture: userData.profilePicture || userData.profile_picture || undefined
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile data. Please try again later.');
        // Set a default state to prevent infinite retries
        setUserProfile({
          full_name: 'User',
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
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex flex-col text-white overflow-hidden box-border">
      {/* Scrollable Content */}
      <div className="flex-1 p-8 overflow-auto pb-24">
        <h1 className="text-2xl font-bold mb-8 text-center"><span className="mx-2 align-text-bottom">👤</span>  Profile</h1>

        {/* Profile Card */}
        <div className="bg-white/10 p-8 mb-6 border border-white/15 shadow-lg text-center">
          {/* Profile Picture */}
          <div
            className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold border-4 border-[#00fb57]/30 ${
              userProfile?.profilePicture
                ? ""
                : "bg-gradient-to-br from-[#00fb57] to-[#00d647] text-[#1a1a1a]"
            }`}
            style={
              userProfile?.profilePicture
                ? {
                    background: `url(${userProfile.profilePicture}) center/cover`,
                  }
                : undefined
            }
          >
            {!userProfile?.profilePicture &&
              userProfile?.full_name.charAt(0).toUpperCase()}
          </div>

          {/* User Name */}
          <h2 className="text-white text-xl font-semibold mb-2">
            {userProfile?.full_name}
          </h2>

          {/* KYC Status */}
          <div className="bg-[#00fb57]/10 border border-[#00fb57]/30 rounded-full px-3 py-1 inline-block mb-6">
            <span className="text-[#00fb57] text-xs font-semibold">
              ✅ KYC Verified
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="bg-white/5 p-4 pl-6 border border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 flex items-center justify-center text-lg">
              📧
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs mb-1 font-semibold uppercase">
                Email Address
              </p>
              <p className="text-white text-sm font-medium m-0">
                {userProfile?.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white/5 p-4 pl-6 border border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-600/20 flex items-center justify-center text-lg">
              📱
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs mb-1 font-semibold uppercase">
                Phone Number
              </p>
              <p className="text-white text-sm font-medium m-0">
                {userProfile?.phone_number}
              </p>
            </div>
          </div>

          {/* Capital Commitment */}
          <div className="bg-white/5 p-4 pl-6 border border-white/10 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00fb57]/20 flex items-center justify-center text-lg">
              💰
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs mb-1 font-semibold uppercase">
                Capital Commitment
              </p>
              <p className="text-white text-sm font-medium m-0">
                ₹{((userProfile?.capital_commitment || 0) / 10000000).toFixed(2)}Cr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;