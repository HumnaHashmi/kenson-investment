/**
 * Formatting utilities for currency, dates, and numbers.
 */

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US',
): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

export const formatDate = (date: string | Date, locale = 'en-US'): string =>
  new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatPercent = (value: number, decimals = 2): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
