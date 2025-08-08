import React, { useState } from 'react';

interface Notification {
  id: string;
  icon: string;
  text: string;
  time: string;
}

const Updates: React.FC = () => {
  const [hasNotifications] = useState<boolean>(true);
  
  // Dummy data based on the notifications in the image
  const notifications: Notification[] = [
    {
      id: '1',
      icon: '$10M+',
      text: 'Your investment is confirmed shares allotted in Startup Inc',
      time: '2m'
    },
    {
      id: '2',
      icon: '$10M+',
      text: 'Your investments is successful in Startup Inc',
      time: '2m'
    },
    {
      id: '3',
      icon: '$10M+',
      text: 'Your investments is successful in Startup Inc',
      time: '2m'
    },
    {
      id: '4',
      icon: '$10M+',
      text: 'Your investments is successful in Startup Inc',
      time: '2m'
    },
    {
      id: '5',
      icon: '$10M+',
      text: 'Your investments is successful in Startup Inc',
      time: '2m'
    }
  ];


  return (
    <div className="inset-0 bg-black flex flex-col text-white overflow-hidden box-border">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#62b3ff] via-[#ff8c9f] to-[#FF0066]" 
           style={{ 
             backgroundSize: '100% 100%', 
             backgroundPosition: '0% 0%' 
           }}>
        <h1 className="text-white text-2xl font-semibold p-6 pb-2">Notifications</h1>
      </div>
      
      {/* Notifications Content */}
      <div className="flex-1 overflow-auto px-4 bg-black mt-4">
        {hasNotifications ? (
          // Notifications list
          <div className="flex flex-col space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center bg-[#2a2a2a] rounded-md p-2">
                <div className="flex-shrink-0 w-10 h-10 bg-[#f2bbc4] flex items-center justify-center rounded-md mr-3">
                  <span className="text-xs font-medium text-black">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{notification.text}</p>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-xs flex items-center justify-center mb-4 relative">
              <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute -right-1 -top-1">
                <div className="w-3 h-3 bg-gray-500 rounded-xs animate-pulse"></div>
              </div>
              <div className="absolute -left-1 top-1">
                <div className="w-3 h-3 bg-gray-500 rounded-xs animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-400">No notification yet</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Updates;
