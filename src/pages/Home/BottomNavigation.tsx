
const tabsList = [
    { label: 'home', icon: '🏡', title: 'Home' },
    { label: 'portfolio', icon: '📊', title: 'Portfolio' },
    { label: 'updates', icon: '📢', title: 'Updates' },
    { label: 'profile', icon: '👨‍💼', title: 'Profile' }
];

const BottomNavigation: React.FC<{ activeTab: string; handleTabChange: (tab: string) => void }> = ({ activeTab, handleTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(26,26,26,0.95)] border-t border-white/20 p-4 backdrop-blur z-[1000]">
        <div className="flex justify-around items-center">
            {tabsList.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                    <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.label)}
                        className={`flex flex-col items-center justify-center cursor-pointer px-3 py-2 min-w-[70px] transition-all duration-300
                            ${isActive
                                ? 'bg-[rgba(0,251,87,0.2)] border border-[rgba(0,251,87,0.4)]'
                                : 'bg-transparent border border-transparent'
                            }`}
                    >
                        <div className="text-[20px] mb-[2px]">
                            {tab.icon}
                        </div>
                        <span className={`text-[11px] ${isActive ? 'text-[#00fb57] font-semibold' : 'text-gray-400 font-normal'}`}>
                            {tab.title}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
  )
}

export default BottomNavigation