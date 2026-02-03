/**
 * Date formatting utility composable
 * Provides standardized date and datetime formatting for the application
 * 
 * Date format: DD/MM/YYYY (e.g., 30/01/2026)
 * DateTime format: DD/MM/YYYY HH:MI:SS AM/PM (e.g., 30/01/2026 09:03:23 AM)
 */

export const useDateFormat = () => {
  /**
   * Format a date value to DD/MM/YYYY format
   * @param {string|Date|null|undefined} value - The date value to format
   * @returns {string} Formatted date string or '-' if invalid
   */
  const formatDate = (value) => {
    if (!value) return '-';
    
    try {
      const date = value instanceof Date ? value : new Date(value);
      
      // Check for invalid date
      if (isNaN(date.getTime())) return '-';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  /**
   * Format a datetime value to DD/MM/YYYY HH:MI:SS AM/PM format
   * @param {string|Date|null|undefined} value - The datetime value to format
   * @returns {string} Formatted datetime string or '-' if invalid
   */
  const formatDateTime = (value) => {
    if (!value) return '-';
    
    try {
      const date = value instanceof Date ? value : new Date(value);
      
      // Check for invalid date
      if (isNaN(date.getTime())) return '-';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = String(hours % 12 || 12).padStart(2, '0');
      
      return `${day}/${month}/${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '-';
    }
  };

  /**
   * Get current date formatted as DD/MM/YYYY
   * @returns {string} Current date formatted
   */
  const getCurrentDate = () => {
    return formatDate(new Date());
  };

  /**
   * Get current datetime formatted as DD/MM/YYYY HH:MI:SS AM/PM
   * @returns {string} Current datetime formatted
   */
  const getCurrentDateTime = () => {
    return formatDateTime(new Date());
  };

  /**
   * Check if a value looks like a date/datetime string
   * @param {any} value - The value to check
   * @returns {boolean} True if it looks like a date
   */
  const isDateLike = (value) => {
    if (!value || typeof value !== 'string') return false;
    
    // Check for ISO date format (2026-01-30T09:03:23.000Z or 2026-01-30)
    const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
    
    // Check for common date patterns
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    ];
    
    if (isoPattern.test(value)) return true;
    
    for (const pattern of datePatterns) {
      if (pattern.test(value)) return true;
    }
    
    return false;
  };

  return {
    formatDate,
    formatDateTime,
    getCurrentDate,
    getCurrentDateTime,
    isDateLike
  };
};

// Export standalone functions for use without composable pattern
export const formatDate = (value) => {
  if (!value) return '-';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '-';
  }
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String(hours % 12 || 12).padStart(2, '0');
    
    return `${day}/${month}/${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return '-';
  }
};
