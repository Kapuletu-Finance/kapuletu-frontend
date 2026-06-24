import { AUTH_URLS } from "@/features/auth/urls";
import type { SecurityRule } from "@/features/shared/security";

export const authSecurityRules: SecurityRule[] = [
  { path: AUTH_URLS.LOGIN, skipAuth: true },
  { path: AUTH_URLS.REGISTER, skipAuth: true },
  { path: AUTH_URLS.FORGOT_PASSWORD, skipAuth: true },
  { path: AUTH_URLS.RESET_PASSWORD, skipAuth: true },
  { path: AUTH_URLS.VERIFY, skipAuth: true },
  { path: AUTH_URLS.ME, skipAuth: false },
  { path: AUTH_URLS.CHANGE_PASSWORD, skipAuth: false },
];
