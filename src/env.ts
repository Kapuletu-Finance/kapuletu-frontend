import { z } from "zod";

const envSchema = z.object({
  ACCESS_TOKEN_COOKIE_NAME: z.string().min(1).default("access_token"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .transform((str) => {
      if (str && !str.startsWith("http")) {
        return `https://${str}`;
      }
      return str;
    })
    .pipe(z.url({ message: "NEXT_PUBLIC_APP_URL must be a valid URL" }))
    .default(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000",
    ),
  NEXT_PUBLIC_BACKEND_URL: z
    .url({
      message: "NEXT_PUBLIC_BACKEND_URL must be a valid URL",
    })
    .default("http://localhost:8000"),
  NEXT_PUBLIC_CSRF_HEADER_NAME: z.string().min(1).default("X-KapuLetu-BFF"),

  NEXT_PUBLIC_ROLE_COOKIE_NAME: z.string().min(1).default("user_role"),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1).default("refresh_token"),
});

export const env = envSchema.parse({
  ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_CSRF_HEADER_NAME: process.env.NEXT_PUBLIC_CSRF_HEADER_NAME,
  NEXT_PUBLIC_ROLE_COOKIE_NAME: process.env.NEXT_PUBLIC_ROLE_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME,
});
