/**
 * Auth slice — ready for Redux Toolkit.
 * Install: yarn add @reduxjs/toolkit react-redux
 */

// Minimal placeholder without the RTK import (add once installed)
import type { AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// --- Replace below with createSlice once @reduxjs/toolkit is installed ---
export const authReducer = (state = initialState) => state;
