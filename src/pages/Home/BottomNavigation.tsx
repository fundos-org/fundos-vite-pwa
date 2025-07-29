import { AiFillHome } from 'react-icons/ai';
import { BiBriefcaseAlt } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';

const tabsList = [
  { label: "home", icon: <AiFillHome size={24} />, title: "home" },
  { label: "portfolio", icon: <BiBriefcaseAlt size={24} />, title: "portfolio" },
  { label: "updates", icon: <IoMdNotifications size={24} />, title: "updates" },
  { label: "profile", icon: <FaUserCircle size={24} />, title: "profile" },
];

const BottomNavigation: React.FC<{
  activeTab: string;
  handleTabChange: (tab: string) => void;
}> = ({ activeTab, handleTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-2 z-[100]">
      <div className="flex justify-around items-center">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => handleTabChange(tab.label)}
              className="flex flex-col items-center justify-center cursor-pointer px-3 py-2"
            >
              <div className={`mb-1 ${isActive ? "text-white" : "text-gray-400"}`}>{tab.icon}</div>
              <span
                className={`text-[12px] ${
                  isActive
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
