export const formatCurrency = (
    number: number,
    locale: string = 'vi-VN',
    currency: string = 'VND'
  ): string => {
    try {
      if (typeof number !== 'number' || isNaN(number)) {
        throw new Error('Invalid number provided to formatCurrency');
      }
  
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(number);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return number.toString();
    }
  };