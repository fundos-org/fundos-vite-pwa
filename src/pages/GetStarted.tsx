import { eRoutes } from "@/RoutesEnum";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/axiosInstance";

const GetStarted = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate(eRoutes.PHONE_NUMBER);

  const [appLogo, setAppLogo] = useState<string>("/logo.svg");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const appNameParam = searchParams.get("appName") || "Fundos";

    const updateFavicon = (href: string) => {
      const ensureLink = (rel: string) => {
        let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = href;
      };
      ensureLink("icon");
      ensureLink("shortcut icon");
      ensureLink("apple-touch-icon");
    };

    // Title: prefer stored title, else set from param and persist
    const storedTitle = localStorage.getItem("APP_TITLE");
    if (storedTitle) {
      document.title = storedTitle;
    } else {
      document.title = appNameParam;
      try {
        localStorage.setItem("APP_TITLE", appNameParam);
      } catch {
        // ignore quota errors
      }
    }

    // Favicon: prefer stored favicon, else fetch and persist
    const storedFavicon = localStorage.getItem("APP_FAVICON");
    if (storedFavicon) {
      setAppLogo(storedFavicon);
      updateFavicon(storedFavicon);
      return;
    }

    api
      .get("/utils/app-logo", { params: { app_name: appNameParam } })
      .then((response) => {
        const logoUrl = response.data as string;
        setAppLogo(logoUrl);
        updateFavicon(logoUrl);
        try {
          localStorage.setItem("APP_FAVICON", logoUrl);
        } catch {
          // ignore quota errors
        }
      })
      .catch(() => {
        setAppLogo("/logo.svg");
        updateFavicon("/logo.svg");
        try {
          localStorage.setItem("APP_FAVICON", "/logo.svg");
        } catch {
          // ignore quota errors
        }
      });
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-black text-white p-4 justify-between">
      <img
        src={appLogo}
        alt="Get Started Illustration"
        className="mb-25 w-2/3 self-center"
      />

      <div>
        <h1 className="text-[2.5rem] font-bold mb-[30px] text-center font-serif">
          Back Bold Ideas!
        </h1>

        <button
          onClick={handleGetStarted}
          className="bg-white text-black border-none py-4 text-lg font-medium cursor-pointer w-full"
        >
          Get started
        </button>
      </div>

      <div className="flex flex-col gap-1 items-center justify-center w-full mt-72">
        <p>Powered by</p>

        <img className="h-[20%] w-[20%]" src="/logo.svg" alt="" />
      </div>
    </div>
  );
};

export default GetStarted;
