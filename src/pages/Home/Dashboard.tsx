import { useEffect } from "react";
import toast from "react-hot-toast";
import BottomNavigation from "./BottomNavigation";
import { useHomeContext } from "@/Shared/useLocalContextState";
import { eRoutes } from "@/RoutesEnum";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLocalContextState } = useHomeContext();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedSubAdminId = sessionStorage.getItem("subAdminId");
    setLocalContextState((prev) => ({
      ...prev,
      userId: storedUserId ?? "",
      subAdminId: storedSubAdminId ?? "",
    }));
    if (!storedUserId) {
      toast.error(
        (t) => (
          <span>
            User ID not found. Please login again.
            <button
              onClick={() => {
                navigate(eRoutes.PHONE_NUMBER);
                toast.dismiss(t.id);
              }}
              style={{
                marginLeft: "10px",
                color: "#fff",
                background: "#007bff",
                border: "none",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </span>
        ),
        { duration: 8000 }
      );
      return;
    }
  }, [navigate, setLocalContextState]);

  const handleTabChange = (tabLabel: string) => {
    switch (tabLabel) {
      case "home":
        navigate(eRoutes.DASHBOARD_HOME);
        break;
      case "portfolio":
        navigate(eRoutes.DASHBOARD_PORTFOLIO);
        break;
      case "updates":
        navigate(eRoutes.DASHBOARD_UPDATES);
        break;
      case "profile":
        navigate(eRoutes.DASHBOARD_PROFILE);
        break;
      case "deals":
        navigate(eRoutes.DASHBOARD_DEALS);
        break;
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/portfolio")) return "portfolio";
    if (path.includes("/updates")) return "updates";
    if (path.includes("/profile")) return "profile";
        return "home";
  };

  return (
    <>
      <Outlet />
      <BottomNavigation
        activeTab={getActiveTab()}
        handleTabChange={handleTabChange}
      />
    </>
  );
};

export default Dashboard;
