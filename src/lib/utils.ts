import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format wallet address
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format Creditcoinamount
export function formatCreditcoin(value: string | number, decimals = 4): string {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) {
    return "0.00";
  }
  return number.toFixed(decimals);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Generate payment URL
export function generatePaymentUrl(address: string, amount?: string): string {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://CredPay.app";

  const url = new URL(`/pay/${address}`, baseUrl);
  if (amount) {
    url.searchParams.set("amount", amount);
  }

  return url.toString();
}

/**
 * =============================================================================
 * Address validation functions
 * =============================================================================
 */

export function isValidCreditcoinAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * @deprecated Use isValidCreditcoinAddress instead
 */
export function isValidEthereumAddress(address: string): boolean {
  return isValidCreditcoinAddress(address); // Re-use logic for now
}

/**
 * =============================================================================
 * Currency formatting functions
 * =============================================================================
 */

export function formatCurrency(
  value: string | number,
  currency: string,
  decimals = 4
): string {
  return formatCreditcoin(value, decimals); // Re-use logic for now
}

/**
 * =============================================================================
 * Debounce function
 * =============================================================================
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * =============================================================================
 * Device detection functions
 * =============================================================================
 */

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
