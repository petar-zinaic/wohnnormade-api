export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string | null;
    surname: string | null;
    city: string | null;
    country: string | null;
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
