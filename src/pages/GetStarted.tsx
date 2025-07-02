import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => navigate(eRoutes.PHONE_NUMBER);

  return (
    <div className="flex flex-col items-end justify-end h-full w-full bg-black text-white p-6">
      <h1 className="text-[2.5rem] font-bold mb-[30px] text-start font-serif">
        Invest in What's Next.
      </h1>
      
    <button
      onClick={handleGetStarted}
      className="bg-white text-black border-none py-4 text-lg font-medium cursor-pointer w-full"
    >
      Get started
    </button>
    </div>
  );
};

export default GetStarted;