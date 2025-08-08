import { eRoutes } from "@/RoutesEnum";
import { useNavigate } from "react-router-dom";
import getStartedImg from "@/assets/3.png";

const GetStarted = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate(eRoutes.PHONE_NUMBER);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-black text-white p-4">
      <img
        src={getStartedImg}
        alt="Get Started Illustration"
        className="mb-25 w-2/3 self-center"
      />
      <h1 className="text-[2.5rem] font-bold mb-[30px] text-center font-serif">
        Back Bold Ideas!
      </h1>

      <button
        onClick={handleGetStarted}
        className="bg-white text-black border-none py-4 text-lg font-medium cursor-pointer w-full"
      >
        Get started
      </button>

      <div className="flex flex-col gap-1 items-center justify-center w-full mt-72">
        <p>Powered by</p>

        <img className="h-[20%] w-[20%]" src="/logo.svg" alt="" />
      </div>
    </div>
  );
};

export default GetStarted;
