import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeContext } from "@/Shared/useLocalContextState";
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { localContextState } = useHomeContext();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    investorType: 'Individual',
    panNumber: '',
    aadharNumber: '',
    occupation: '',
    incomeSource: '',
    annualIncome: ''
  });

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

        // For demo, using randomized mock data instead of actual API data
        const firstNames = ['Rahul', 'Amit', 'Priya', 'Neha', 'Vikram', 'Anjali', 'Ravi', 'Sanjay'];
        const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Verma', 'Gupta', 'Joshi'];
        const occupations = ['Founder', 'CEO', 'Engineer', 'Doctor', 'Consultant', 'Entrepreneur', 'Manager', 'Analyst'];
        const incomeSources = ['Business', 'Salary', 'Investments', 'Self-employed', 'Rental'];
        const incomeRanges = ['1Cr - 5Cr', '50L - 1Cr', '25L - 50L', '10L - 25L', '5L - 10L'];
        
        // Generate random 10-digit phone number with +91 prefix
        const randomPhone = `+91-${Math.floor(9000000000 + Math.random() * 1000000000)}`;
        
        // Generate random email
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
        const randomEmail = `${randomFirstName}@${['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'][Math.floor(Math.random() * 4)]}`;
        
        // Generate random PAN (5 letters, 4 numbers, 1 letter)
        const randomPAN = Array(5).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('') + 
                          Array(4).fill(0).map(() => Math.floor(Math.random() * 10)).join('') +
                          String.fromCharCode(65 + Math.floor(Math.random() * 26));
        
        // Generate masked Aadhar (first 4 digits, then masked, then last 4)
        const firstFour = Math.floor(1000 + Math.random() * 9000).toString();
        const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
        
        setProfileData({
          firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
          lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
          phoneNumber: randomPhone,
          email: randomEmail,
          investorType: Math.random() > 0.3 ? 'Individual' : 'Corporate',
          panNumber: randomPAN,
          aadharNumber: `${firstFour} **** **** ${lastFour}`,
          occupation: occupations[Math.floor(Math.random() * occupations.length)],
          incomeSource: incomeSources[Math.floor(Math.random() * incomeSources.length)],
          annualIncome: incomeRanges[Math.floor(Math.random() * incomeRanges.length)]
        });
      } catch (error) {
        console.error('Error setting up profile data:', error);
        toast.error('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [localContextState.userId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleLogout = () => {
    // Clear session/local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    
    // Navigate to login or root
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 backdrop-blur text-center">
          <div className="w-15 h-15 border-4 border-gray-700 border-t-[#00fb57] rounded-full animate-spin mx-auto mb-5"></div>
          <h2 className="text-2xl font-medium text-[#FDFDFD] mb-2">
            Loading Profile
          </h2>
          <p className="text-sm text-gray-400 m-0">
            Please wait while we load your profile data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white">
      {/* Header */}
      <div className="p-3 flex items-center border-b border-white/10">
        <button 
          onClick={handleBack} 
          className="p-2 mr-3 bg-[#1E1D1F] rounded-none flex items-center justify-center"
        >
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-medium">My profile</h1>
      </div>

      {/* Form fields */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-4 pb-28"> {/* Added extra bottom padding to prevent content being hidden by bottom nav */}
          {/* First name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              First name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              readOnly
              className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
            />
          </div>

          {/* Last name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Last name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              readOnly
              className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Phone number
            </label>
            <input
              type="text"
              value={profileData.phoneNumber}
              readOnly
              className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              E-mail address
            </label>
            <input
              type="email"
              value={profileData.email}
              readOnly
              className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
            />
          </div>

          {/* Investor type */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Investor type
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.investorType}
                readOnly
                className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* PAN number */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              PAN number
            </label>
            <input
              type="text"
              value={profileData.panNumber}
              readOnly
              className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
            />
          </div>

          {/* Aadhar number */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Aadhar number
            </label>
            <input
              type="text"
              value={profileData.aadharNumber}
              readOnly
              className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Occupation
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.occupation}
                readOnly
                className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Income source */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Income source
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.incomeSource}
                readOnly
                className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Annual income */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Annual income
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.annualIncome}
                readOnly
                className="w-full p-3 bg-[#1E1D1F] border border-gray-700 text-white rounded-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div className="pt-2">
            <button 
              onClick={handleLogout}
              className="w-full p-3 bg-[#4C1D22] text-red-400 rounded-none"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
