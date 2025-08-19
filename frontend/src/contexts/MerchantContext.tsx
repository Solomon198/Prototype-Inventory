import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Marchant } from "../types";

interface MerchantContextType {
  selectedMerchant: Marchant | null;
  setSelectedMerchant: (merchant: Marchant | null) => void;
  clearSelectedMerchant: () => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(
  undefined
);

interface MerchantProviderProps {
  children: ReactNode;
}

export const MerchantProvider = ({ children }: MerchantProviderProps) => {
  const [selectedMerchant, setSelectedMerchant] = useState<Marchant | null>(
    null
  );

  const clearSelectedMerchant = () => {
    setSelectedMerchant(null);
  };

  return (
    <MerchantContext.Provider
      value={{
        selectedMerchant,
        setSelectedMerchant,
        clearSelectedMerchant,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (context === undefined) {
    throw new Error("useMerchant must be used within a MerchantProvider");
  }
  return context;
};
