import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const APP_NAME_KEY = "appName";

export default function AppNameGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlAppName = (params.get("appName") || "").trim();
    const storedAppName = (sessionStorage.getItem(APP_NAME_KEY) || "").trim();

    // If URL missing appName but we have one stored, add it.
    if (!urlAppName && storedAppName) {
      const next = new URLSearchParams(params);
      next.set("appName", storedAppName);
      navigate(
        { pathname: location.pathname, search: next.toString() },
        { replace: true }
      );
      return;
    }

    // First load: persist the appName from URL.
    if (urlAppName && !storedAppName) {
      sessionStorage.setItem(APP_NAME_KEY, urlAppName);
      return;
    }

    // Change detected: trigger logout.
    if (urlAppName && storedAppName && urlAppName !== storedAppName) {
      sessionStorage.clear();
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");
      } catch {
        //empty
      }
      // Set new baseline so we don't loop.
      sessionStorage.setItem(APP_NAME_KEY, urlAppName);

      const next = new URLSearchParams();
      next.set("appName", urlAppName);
      navigate({ pathname: "/", search: next.toString() }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return null;
}
