import { LocalContextState } from "@/pages/Home/HomeContextProvider";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface HomeContextType {
  localContextState: LocalContextState;
  setLocalContextState: Dispatch<SetStateAction<Partial<LocalContextState>>>;
}

export const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within a HomeProvider");
  }
  return context;
};