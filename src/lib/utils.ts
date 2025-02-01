import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a phone number to E.164 format.
 * @param phone - The input phone number as a string.
 * @param defaultCountry - The default country code (e.g., 'IN' for India).
 * @returns The phone number in E.164 format or null if invalid.
 */
export const formatPhoneNumber = (
  phone: string,
  defaultCountry: string = 'IN' // Default to India; change as needed
): string | null => {
  try {
    // Parse the phone number with the default country
    const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry as CountryCode);

    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.number; // E.164 format
    }

    console.error('Invalid phone number according to E.164:', phone);
    return null;
  } catch (error) {
    console.error('Error parsing phone number:', error);
    return null;
  }
};
