import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required."),
  password: z.string({ message: "Password is required." }).min(1, "Password is required."),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    confirmPassword: z
      .string({ message: "Please confirm your password." })
      .min(1, "Please confirm your password."),
    consent: z.boolean().refine((val) => val === true, {
      message: "Please agree to our Terms of Service and Privacy Policy to continue.",
    }),
    marketingConsent: z.boolean(),
    email: z.email("Please enter a valid email address.").min(1, "Email is required."),
    firstName: z
      .string({ message: "First name is required." })
      .min(1, "First name is required.")
      .min(2, "First name must be at least 2 characters."),
    lastName: z
      .string({ message: "Last name is required." })
      .min(1, "Last name is required.")
      .min(2, "Last name must be at least 2 characters."),
    password: z
      .string({ message: "Password is required." })
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters long."),
    phoneNumber: z
      .string({ message: "Phone number is required." })
      .regex(/^(?:\+2547|\+2541|07|01)\d{8}$/, "Please enter a valid phone number.")
      .min(1, "Phone number is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Forgot password accepts email OR phone number.
 * The backend uses a single `identifier` field (IdentifierBase).
 */
export const forgotPasswordSchema = z.object({
  identifier: z
    .string({ message: "Email or phone number is required." })
    .min(1, "Email or phone number is required."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password uses an OTP code sent to phone/email.
 * Backend ResetPasswordIn: identifier + code (6-digit) + new_password.
 */
export const resetPasswordSchema = z
  .object({
    code: z
      .string({ message: "Verification code is required." })
      .length(6, "Verification code must be exactly 6 digits."),
    confirmPassword: z
      .string({ message: "Please confirm your password." })
      .min(1, "Please confirm your password."),
    identifier: z
      .string({ message: "Email or phone number is required." })
      .min(1, "Email or phone number is required."),
    password: z
      .string({ message: "Password is required." })
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Change password — field names match backend ChangePasswordIn:
 *   old_password, new_password.
 */
export const changePasswordSchema = z
  .object({
    confirmNewPassword: z
      .string({ message: "Please confirm your new password." })
      .min(1, "Please confirm your new password."),
    newPassword: z
      .string({ message: "New password is required." })
      .min(1, "New password is required.")
      .min(8, "New password must be at least 8 characters long."),
    oldPassword: z
      .string({ message: "Current password is required." })
      .min(1, "Current password is required."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Update profile — backend UpdateProfileIn has no email field.
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string({ message: "First name is required." })
    .min(1, "First name is required.")
    .min(2, "First name must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string({ message: "Last name is required." })
    .min(1, "Last name is required.")
    .min(2, "Last name must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string({ message: "Phone number is required." })
    .regex(/^(?:\+2547|\+2541|07|01)\d{8}$/, "Please enter a valid phone number.")
    .min(1, "Phone number is required.")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const verifySchema = z.object({
  code: z
    .string({ message: "Verification code is required." })
    .min(1, "Verification code is required.")
    .length(6, "Verification code must be exactly 6 digits."),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
