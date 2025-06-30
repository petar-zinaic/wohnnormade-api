export interface AuthResponse {
  user: {
    id: number;
    email: string;
    createdAt: Date;
  };
  token: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

export interface ChangePasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
