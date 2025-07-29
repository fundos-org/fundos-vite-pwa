import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const NotificationsSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center border-b border-white/10">
        <button 
          onClick={handleBack} 
          className="p-2 mr-3 bg-[#1E1D1F] rounded-none flex items-center justify-center"
        >
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-medium">Manage notifications</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 px-5 py-4">
        {/* Notification Toggle */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Allow notifications</h2>
          <button 
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ease-in-out duration-200 ${notificationsEnabled ? 'bg-white' : 'bg-gray-600'}`}
          >
            <span 
              className={`inline-block w-5 h-5 transform transition ease-in-out duration-200 rounded-full ${notificationsEnabled ? 'translate-x-6 bg-black' : 'translate-x-1 bg-gray-300'}`} 
            >
              {notificationsEnabled && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm">
          You'll receive in-app notifications about recent activities on your account.
        </p>
      </div>
    </div>
  );
};

export default NotificationsSettings;
