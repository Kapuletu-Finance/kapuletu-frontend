export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

export type ApiErrorResponse = {
  detail?: string | ValidationError[];
  message?: string;
};
