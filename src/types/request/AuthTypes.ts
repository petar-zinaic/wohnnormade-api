export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  surname?: string;
  city?: string;
  country?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  surname?: string;
  city?: string;
  country?: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  surname?: string;
  city?: string;
  country?: string;
}
