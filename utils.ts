
export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getMonthName = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
