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
    <div 
      className="flex-1 flex flex-col h-full w-full min-h-screen"
      style={{
        background: `linear-gradient(to bottom, #4285F4 50%, #ffffff 50%)`
      }}
    >
      {/* Top blue section with background pattern */}
      <div className="relative text-white px-6 py-12 flex-1 flex flex-col">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
          {/* Scattered dots */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Logo and welcome content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8">
            {syndicateName ? (
              <div className="text-4xl font-bold leading-none">
                {syndicateName}
              </div>
            ) : (
              <div className="text-4xl font-bold leading-none">
                <span className="text-white">Fund</span>
                <span className="text-orange-400">OS</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg opacity-90">Start your investment journey with confidence</p>
        </div>
      </div>

      {/* White content section with feature cards */}
      <div className="px-6 py-8 flex-1 flex flex-col">
        <div className="space-y-4 mb-8">
          {/* Feature Card 1 */}
          <div className="flex items-start space-x-4 p-4 bg-white border-l-4 border-orange-400 rounded-lg shadow-sm">
            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Bank-Level Security</h3>
              <p className="text-gray-600 text-sm">Your data is protected with encryption</p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="flex items-start space-x-4 p-4 bg-white border-l-4 border-orange-400 rounded-lg shadow-sm">
            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Quick Setup</h3>
              <p className="text-gray-600 text-sm">Get started in just 3 minutes with our streamlined process</p>
            </div>
          </div>
        </div>

        {/* Call to action button */}
        <div className="mt-auto mb-6">
          <button
            onClick={handleGetStarted}
            className="w-full bg-[#4285F4] text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Let's Get Started
          </button>
        </div>

        {/* Powered by section */}
        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <p className="text-gray-600">Powered by</p>
          <div className="text-2xl font-bold">
            <span className="text-black">Fund</span>
            <span className="text-[#4285F4]">OS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
