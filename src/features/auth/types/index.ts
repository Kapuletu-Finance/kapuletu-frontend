/**
 * User type exactly mapping the KapuLetu backend SQLAlchemy `User` model.
 */
export type User = {
  user_id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "treasurer" | "admin" | "super_admin";
  is_active: boolean;
  is_email_verified?: boolean;
  created_at: string; // ISO 8601 DateTime
};

/**
 * Authentication response from our proxy which extends the user
 * with any proxy-specific metadata (though our proxy currently
 * strips tokens and passes the rest).
 */
export type AuthResponse = User;

export type SignInRequest = {
  email?: string;
  phone_number?: string;
  password: string;
};

export type SignUpRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "treasurer" | "admin";
};

export type ForgotPasswordRequest = {
  phone_number: string;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export type UpdateProfileRequest = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
};

export type VerifyRequest = {
  code: string;
};
