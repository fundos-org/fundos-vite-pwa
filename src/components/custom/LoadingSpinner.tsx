const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="w-10 h-10 border-4 border-gray-700 border-t-[#00fb57] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;