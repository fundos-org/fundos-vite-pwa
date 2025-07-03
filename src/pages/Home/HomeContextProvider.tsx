import { HomeContext } from "@/Shared/useLocalContextState";
import { useState, ReactNode } from "react";

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

  return (
    <HomeContext.Provider value={{ localContextState, setLocalContextState }}>
      {children}
    </HomeContext.Provider>
  );
};

