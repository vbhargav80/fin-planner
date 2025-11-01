
export const formatCurrency = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '$0.00';
    }
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-AU', {
        year: 'numeric',
        month: 'short'
    }).format(date);
};