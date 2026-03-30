/**
 * Formats a numeric quote number into a display string with padding.
 * Implements a strict DTO pattern (Data Transfer Object).
 * 
 * @param num The raw integer from DB
 * @returns A formatted string e.g. "COT-000001"
 */
export function formatQuoteNumber(num: number): string {
  if (typeof num !== 'number') {
    console.warn('[QUOTE-UTILS] formatQuoteNumber received non-number:', num);
    return 'COT-000000';
  }
  return `COT-${num.toString().padStart(6, '0')}`;
}

/**
 * Enhances a quote object with UI-specific fields without mutating the original.
 * Follows IMMUTABLE patterns to avoid database syntax errors during re-insertion.
 * 
 * @param quote The raw quote object from the database
 * @returns A NEW object with the display_quote_number field added
 */
export function enhanceQuote<T extends { quote_number: number }>(quote: T) {
  if (!quote) return null;
  
  // Create a deep-ish copy to ensure no shared references
  const enhanced = { ...quote };
  
  // Add the display field as a SEPARATE property
  // DO NOT OVERWRITE quote_number
  return {
    ...enhanced,
    display_quote_number: formatQuoteNumber(quote.quote_number)
  };
}
