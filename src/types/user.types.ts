export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  zipCode?: string;
  country?: string;
  avatarUrl?: string;
  createdAt: string;
  referralCode?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardSummary {
  lastMonthProfit: number;
  overallProfit: number;
  availableBalance: number;
  investedAmount: number;
}

export interface Deposit {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface WithdrawRequest {
  id: string;
  srNo: number;
  amount: number;
  date: string;
  method: string;
  reference?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  platformCharges: number;
  fee: number;
  additionalCharges: number;
  remarks?: string;
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'registered' | 'earned';
  bonus: number;
  date: string;
}

export interface EducationFolder {
  id: string;
  title: string;
  fileCount: number;
  thumbnailColor: string;
}

export interface EducationVideo {
  id: string;
  title: string;
  duration: string;
  folderId: string;
  url: any;
}
