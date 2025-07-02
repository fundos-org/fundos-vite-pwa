
const Updates: React.FC = () => {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] flex flex-col text-white overflow-hidden box-border">
        {/* Scrollable Content */}
        <div className="flex-1 p-8 pb-24 overflow-auto text-center">
            <h1 className="text-white text-2xl font-bold mb-8">
                <span className="mx-2 align-text-bottom">🔔</span> Updates
            </h1>
            <div className="bg-white/5 p-12 px-8 border border-white/10">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-[#00fb57] text-lg font-semibold mb-4">
                    Latest Updates
                </h3>
                <p className="text-gray-400 text-sm m-0 leading-relaxed">
                    Stay informed with the latest deal updates, notifications, and important announcements. Coming soon!
                </p>
            </div>
        </div>
    </div>
  )
}

export default Updates;
