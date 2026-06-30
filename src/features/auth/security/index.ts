import { AUTH_URLS } from "@/features/auth/urls";
import type { SecurityRule } from "@/features/shared/security";

export const authSecurityRules: SecurityRule[] = [
  { path: AUTH_URLS.SIGN_IN, skipAuth: true },
  { path: AUTH_URLS.SIGN_UP, skipAuth: true },
  { path: AUTH_URLS.FORGOT_PASSWORD, skipAuth: true },
  { path: AUTH_URLS.RESET_PASSWORD, skipAuth: true },
  { path: AUTH_URLS.ME, skipAuth: false },
  { path: AUTH_URLS.CHANGE_PASSWORD, skipAuth: false },
];
