/**
 * Built-in user roles, matching the backend UserRole enum.
 */
export type UserRole =
  | "treasurer"
  | "admin"
  | "super_admin"
  | "support_agent"
  | "content_manager"
  | "finance_manager";

/**
 * User type exactly mapping the KapuLetu backend `UserOut` schema.
 */
export type User = {
  user_id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  email_verified: boolean;
  phone_number_verified: boolean;
  role: string;
  permissions?: string[];
  profile_picture_url?: string | null;
  two_factor_enabled: boolean;
  two_factor_channel: string | null;
  is_waitlisted: boolean;
};

/**
 * Authentication response from our proxy after sign-in.
 * The proxy strips tokens, sets httpOnly cookies, then returns
 * a lightweight object with only the role (read from role cookie).
 */
export type AuthResponse = User;

/**
 * Response from /auth/register — backend RegisterOut schema.
 */
export type RegisterOut = {
  message: string;
  user_id: string;
};

/**
 * Proxy-synthesised response after sign-in.
 * The BFF proxy calls /auth/me after login and returns this.
 */
export type SignInResponse = {
  role: string;
  phone_number_verified?: boolean;
  requires_2fa?: boolean;
  two_fa_token?: string;
  is_waitlisted?: boolean;
};

export type SignInRequest = {
  /** Email address or phone number — backend IdentifierBase */
  identifier: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number: string;
  marketing_consent: boolean;
  invite_token?: string;
};

export type ForgotPasswordRequest = {
  /** Email address or phone number — backend IdentifierBase */
  identifier: string;
};

export type ResetPasswordRequest = {
  /** Email address or phone number — backend IdentifierBase */
  identifier: string;
  /** 6-digit OTP sent to phone/email */
  code: string;
  new_password: string;
};

export type ChangePasswordRequest = {
  /** Field name matches backend ChangePasswordIn */
  old_password: string;
  new_password: string;
};

export type UpdateProfileRequest = {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
};

export type VerifyRequest = {
  code: string;
};

export type VerifyPhoneRequest = {
  /** Email address or phone number — backend IdentifierBase */
  identifier: string;
  /** 6-digit OTP code */
  code: string;
};

export type ResendCodeRequest = {
  /** Email address or phone number — backend IdentifierBase */
  identifier: string;
};

export interface SubscriptionResponse {
  active_plan: string;
  is_on_trial: boolean;
  has_used_trial: boolean;
  days_remaining: number;
  expiry_date: string | null;
  usage: {
    groups: string;
    campaigns: string;
    /** Approved contributions this month / monthly limit */
    transactions?: string;
  };
  allowed_features?: Record<string, boolean>;
  /** Stable plan id; "basic" is the free tier */
  plan_code?: string | null;
  /** Always false for now: plans are paid period by period */
  renews_automatically?: boolean;
}

export type BillingHistoryOut = {
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  provider_reference: string | null;
  created_at: string;
  transaction_type?: "payment" | "refund" | "comp" | null;
  invoice_number?: string | null;
  plan_name?: string | null;
};

export type BillingSettings = {
  auto_renew_subscription: boolean;
  billing_email: string | null;
};
