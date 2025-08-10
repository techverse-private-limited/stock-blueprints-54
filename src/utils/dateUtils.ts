
/**
 * Get a date string in YYYY-MM-DD format
 */
export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date string in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return getDateString(new Date());
};

/**
 * Parse a date string back to a Date object
 */
export const parseDateString = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Format a date for display
 */
export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get current India time (IST is UTC+5:30)
export const getIndiaDate = (): Date => {
  const now = new Date();
  // Convert to India timezone by adding 5 hours 30 minutes
  const indiaOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const indiaTime = new Date(utc + indiaOffset);
  return indiaTime;
};

// Get today's date in India timezone as a Date object (without time)
export const getIndiaTodayDate = (): Date => {
  const indiaDate = getIndiaDate();
  // Reset time to start of day
  return new Date(indiaDate.getFullYear(), indiaDate.getMonth(), indiaDate.getDate());
};

// Format date for display with full month name
export const formatIndiaDateLong = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
