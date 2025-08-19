// Utility to get the current merchant ID from localStorage or context
export const getCurrentMerchantId = (): string | null => {
  return localStorage.getItem("currentMerchantId");
};

export const setCurrentMerchantId = (merchantId: string): void => {
  localStorage.setItem("currentMerchantId", merchantId);
};

export const clearCurrentMerchantId = (): void => {
  localStorage.removeItem("currentMerchantId");
};

// Helper to add merchant ID to API requests
export const addMerchantIdToParams = (
  params: Record<string, any> = {}
): Record<string, any> => {
  const merchantId = getCurrentMerchantId();
  if (merchantId) {
    return { ...params, merchantId };
  }
  return params;
};
