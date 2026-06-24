export type SecurityRule = {
  path: string | RegExp;
  allowedRoles?: string[];
  skipAuth?: boolean;
};
