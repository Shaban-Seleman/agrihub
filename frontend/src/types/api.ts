export type ApiSuccess<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
