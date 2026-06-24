/**
 * User type exactly mapping the KapuLetu backend SQLAlchemy `User` model.
 */
export interface User {
  user_id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "treasurer" | "admin" | "super_admin";
  is_active: boolean;
  created_at: string; // ISO 8601 DateTime
}

/**
 * Authentication response from our proxy which extends the user
 * with any proxy-specific metadata (though our proxy currently
 * strips tokens and passes the rest).
 */
export interface AuthResponse extends User {}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "treasurer" | "admin";
}

export interface ForgotPasswordRequest {
  phone_number: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

export interface VerifyRequest {
  code: string;
}
