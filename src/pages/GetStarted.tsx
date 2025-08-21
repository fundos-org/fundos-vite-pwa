import { eRoutes } from "@/RoutesEnum";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/axiosInstance";

interface AppLogoResponse {
  presigned_url: string;
  syndicate_name: string;
}

const GetStarted = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate(eRoutes.PHONE_NUMBER);

  const [, setAppLogo] = useState<string>("/logo.svg");
  const [syndicateName, setSyndicateName] = useState<string>("");

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

    // Always make API call when appName is provided to get syndicate name
    if (appNameParam && appNameParam !== "Fundos") {
      api
        .get("/utils/app-logo", { params: { app_name: appNameParam } })
        .then((response) => {
          const data = response.data as AppLogoResponse;
          const logoUrl = data.presigned_url;
          setAppLogo(logoUrl);
          setSyndicateName(data.syndicate_name);
          updateFavicon(logoUrl);
          try {
            localStorage.setItem("APP_FAVICON", logoUrl);
          } catch {
            // ignore quota errors
          }
        })
        .catch((error) => {
          console.log("API call failed:", error);
          setAppLogo("/logo.svg");
          setSyndicateName("");
          updateFavicon("/logo.svg");
          try {
            localStorage.setItem("APP_FAVICON", "/logo.svg");
          } catch {
            // ignore quota errors
          }
        });
    } else {
      // Favicon: prefer stored favicon for default case
      const storedFavicon = localStorage.getItem("APP_FAVICON");
      if (storedFavicon) {
        setAppLogo(storedFavicon);
        updateFavicon(storedFavicon);
      } else {
        setAppLogo("/logo.svg");
        updateFavicon("/logo.svg");
      }
    }
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-black text-white p-4 min-h-screen">
      {/* Top section with text and title */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-2/3 self-center mb-8 text-center">
          {syndicateName ? (
            <>
              <div className="text-6xl font-bold leading-none text-pink-400">
                {syndicateName}
              </div>
              <div className="text-white text-xl font-medium opacity-90 -mt-2">
                Click. Sign. Raise.
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl font-bold leading-none">
                <span className="text-white">Fund</span>
                <span className="text-pink-400">OS</span>
              </div>
              <div className="text-white text-xl font-medium opacity-90 -mt-2">
                Click. Sign. Raise.
              </div>
            </>
          )}
        </div>

        <h1 className="text-[2rem] font-bold mb-[15px] text-center font-serif">
          Back Bold Ideas!
        </h1>
      </div>

      {/* Bottom section with button and powered by */}
      <div className="flex flex-col gap-6 pb-4">
        <button
          onClick={handleGetStarted}
          className="bg-white text-black border-none py-4 text-lg font-medium cursor-pointer w-full"
        >
          Get started
        </button>

        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <p>Powered by</p>
          <img className="h-[20%] w-[20%]" src="/logo.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
