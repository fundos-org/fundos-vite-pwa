import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats Indian currency with proper K, L, Cr notation
 * @param amount - The amount to format
 * @returns Formatted string with currency symbol and appropriate suffix
 */
export function formatIndianCurrency(amount?: number | null): string {
  if (!amount || amount === 0) return "₹0";
  
  const absAmount = Math.abs(amount);
  
  // For amounts >= 1 crore (10,000,000)
  if (absAmount >= 10000000) {
    const inCrores = absAmount / 10000000;
    if (inCrores >= 1000) {
      // For very large amounts, show absolute value instead of unwieldy Cr notation
      return `₹${absAmount.toLocaleString('en-IN')}`;
    } else if (inCrores >= 100) {
      // For 100+ crores, no decimal places
      return `₹${Math.round(inCrores)}Cr`;
    } else if (inCrores >= 10) {
      // For 10-99 crores, 1 decimal place
      return `₹${inCrores.toFixed(1)}Cr`;
    } else {
      // For 1-9 crores, 2 decimal places
      return `₹${inCrores.toFixed(2)}Cr`;
    }
  }
  
  // For amounts >= 1 lakh (100,000)
  if (absAmount >= 100000) {
    const inLakhs = absAmount / 100000;
    if (inLakhs >= 10) {
      // For 10+ lakhs, 1 decimal place
      return `₹${inLakhs.toFixed(1)}L`;
    } else {
      // For 1-9 lakhs, 2 decimal places
      return `₹${inLakhs.toFixed(2)}L`;
    }
  }
  
  // For amounts >= 1 thousand (1,000)
  if (absAmount >= 1000) {
    const inThousands = absAmount / 1000;
    if (inThousands >= 10) {
      // For 10+ thousands, 1 decimal place
      return `₹${inThousands.toFixed(1)}K`;
    } else {
      // For 1-9 thousands, 2 decimal places
      return `₹${inThousands.toFixed(2)}K`;
    }
  }
  
  // For amounts less than 1000, show absolute value
  return `₹${Math.round(absAmount)}`;
}
