import { API_ENDPOINTS } from '../constants/api';
import { ApiResponse, User } from '../types';
import { apiService } from './api.service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiService.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, payload),

  register: (payload: LoginPayload & { fullName: string }) =>
    apiService.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, payload),

  logout: () =>
    apiService.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, {}),
};
