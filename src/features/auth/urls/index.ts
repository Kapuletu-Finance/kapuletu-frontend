export const AUTH_URLS = {
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  ME: "/auth/me",
  /** Resend registration OTP code (requires identifier) */
  RESEND_CODE: "/auth/resend-code",
  RESET_PASSWORD: "/auth/reset-password",
  SIGN_IN: "/auth/login",
  SIGN_UP: "/auth/register",
  /** Confirm email verification (requires code; authenticated) */
  VERIFY_EMAIL_CONFIRM: "/auth/verify-email/confirm",
  /** Request email verification code (authenticated, no body) */
  VERIFY_EMAIL_REQUEST: "/auth/verify-email/request",
  /** Verify phone during registration (requires identifier + code) */
  VERIFY_PHONE: "/auth/verify",
} as const;
