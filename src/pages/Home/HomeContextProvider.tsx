import api from "@/lib/axiosInstance";
import { HomeContext } from "@/Shared/useLocalContextState";
import { useState, ReactNode, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface Deal {
  deal_id: string;
  description: string;
  title: string;
  current_valuation: number;
  round_size: number;
  minimum_investment: number;
  commitment: number;
  instruments: string;
  fund_raised_till_now: number;
  logo_url: string;
  management_fee: number;
  company_stage: string;
  carry: number;
  business_model: string;
}

export interface LocalContextState {
    userId?: string;
    investorName?: string;
    subAdminId?: string;
    dealId?: string;
    investmentAmount?: string;
    dealDetails?: Deal;
}

export const HomeProvider = ({ children }: { children: ReactNode }) => {
  const [localContextState, setLocalContextState] = useState<Partial<LocalContextState>>({});

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
      updateFavicon(storedFavicon);
      return;
    }

    api
      .get("/utils/app-logo", { params: { app_name: appNameParam } })
      .then((response) => {
        const logoUrl = response.data as string;
        updateFavicon(logoUrl);
        try {
          localStorage.setItem("APP_FAVICON", logoUrl);
        } catch {
          // ignore quota errors
        }
      })
      .catch(() => {
        updateFavicon("/logo.svg");
        try {
          localStorage.setItem("APP_FAVICON", "/logo.svg");
        } catch {
          // ignore quota errors
        }
      });
  }, [searchParams]);

  return (
    <HomeContext.Provider value={{ localContextState, setLocalContextState }}>
      {children}
    </HomeContext.Provider>
  );
};

