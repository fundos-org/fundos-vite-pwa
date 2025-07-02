import { CircleChevronLeft } from "lucide-react";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  backRoute?: string;
}

export const Layout: FC<LayoutProps> = ({ children, backRoute }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    }
  };

  return (
    <main className="min-h-screen h-screen w-full bg-black flex flex-col items-center p-4 text-white">
      {backRoute && (
        <button
          onClick={handleBack}
          className="bg-transparent border-none text-4xl font-bold text-white cursor-pointer self-start z-10 pl-7 pt-5"
          type="button"
        >
          <CircleChevronLeft size={36} strokeWidth={3} absoluteStrokeWidth />
        </button>
      )}
      {children}
    </main>
  );
};