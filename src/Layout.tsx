import { CircleChevronLeft, LayoutDashboard } from "lucide-react";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  backRoute?: string;
  baseRoute?: string;
}

export const Layout: FC<LayoutProps> = ({ children, backRoute, baseRoute }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    }
  };
  const handleBaseRoute = () => {
    if (baseRoute) {
      navigate(baseRoute);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between w-full bg-black flex-shrink-0">
        {backRoute && (
          <button
            onClick={handleBack}
            className="bg-[#383739] p-2 rounded-r-full border-none text-4xl font-bold text-white cursor-pointer self-start z-10 pl-6 mt-5"
            type="button"
          >
            <CircleChevronLeft size={36} strokeWidth={3} absoluteStrokeWidth />
          </button>
        )}
        {baseRoute && (
          <button
            onClick={handleBaseRoute}
            className="bg-[#383739] p-2 rounded-l border-none text-4xl font-bold text-white cursor-pointer self-start z-10 pr-6 mt-5"
            type="button"
          >
            <LayoutDashboard size={36} strokeWidth={3} absoluteStrokeWidth />
          </button>
        )}
      </div>
      <main className="flex-1 w-full bg-black text-white overflow-hidden">
        {children}
      </main>
    </div>
  );
};