/**
 * Common validation helpers.
 */

const BLOCKED_EMAIL_HOSTS = ['yopmail.com'];

export const isValidEmail = (email: string): boolean => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const host = email.split('@')[1]?.toLowerCase();
  return !BLOCKED_EMAIL_HOSTS.includes(host);
};

export const isValidPassword = (password: string): boolean =>
  password.length >= 8;

export const isNotEmpty = (value: string): boolean => value.trim().length > 0;

export const validateSubject = (value: string): string => {
  if (!value.trim()) return 'Subject is required';
  if (value.trim().length < 5) return 'Subject must be at least 5 characters';
  return '';
};

export const validateMessage = (value: string): string => {
  if (!value.trim()) return 'Message is required';
  if (value.trim().length < 20) return 'Message must be at least 20 characters';
  return '';
};

export type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  address: string;
  zipCode: string;
  country: string;
};

export const validateProfileForm = (form: ProfileForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!form.firstName.trim())
    errors.firstName = 'First name is required';
  else if (!/^[a-zA-Z\s.]+$/.test(form.firstName.trim()))
    errors.firstName = 'First name may only contain letters, spaces and dots';

  if (!form.lastName.trim())
    errors.lastName = 'Last name is required';
  else if (!/^[a-zA-Z\s.]+$/.test(form.lastName.trim()))
    errors.lastName = 'Last name may only contain letters, spaces and dots';

  const digits = form.phone.replace(/\D/g, '');
  if (digits.length < 7)
    errors.phone = 'Enter a valid phone number';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dob))
    errors.dob = 'Use format YYYY-MM-DD';

  if (!form.address.trim())
    errors.address = 'Address is required';

  if (!form.zipCode.trim())
    errors.zipCode = 'Zip code is required';

  if (!form.country)
    errors.country = 'Please select a country';

  return errors;
};

export const validateWithdrawAmount = (
  value: string,
  availableBalance: number,
  min = 100,
): string => {
  if (!value.trim()) return 'Amount is required';
  const num = parseInt(value, 10);
  if (isNaN(num) || num <= 0) return 'Enter a valid amount';
  if (num < min) return `Minimum withdrawal is $${min}`;
  if (num > availableBalance) return `Cannot exceed available balance of $${availableBalance.toLocaleString()}`;
  return '';
};
