import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BaseService from "../BaseService";
import UserRepository from "../../repositories/database/UserRepository";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput,
  ForgotPasswordInput,
} from "../../types/request/AuthTypes";
import {
  RegisterResponse,
  LoginResponse,
  ChangePasswordResponse,
  ResetPasswordResponse,
  ForgotPasswordResponse,
} from "../../types/response/AuthTypes";
import envConfig from "@config/environment";

export default class AuthService extends BaseService<UserRepository> {
  constructor() {
    super(new UserRepository());
  }

  async register(data: RegisterInput): Promise<RegisterResponse> {
    // Check if user already exists
    const existingUser = await this._repository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create user with all fields
    const user = await this._repository.createUserWithDetails({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      surname: data.surname,
      city: data.city,
      country: data.country,
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login(data: LoginInput): Promise<LoginResponse> {
    // Find user by email
    const user = await this._repository.findUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async changePassword(
    userId: number,
    data: ChangePasswordInput
  ): Promise<ChangePasswordResponse> {
    // Find user
    const user = await this._repository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(data.newPassword, saltRounds);

    // Update password
    await this._repository.updateUserPassword(userId, hashedNewPassword);

    return {
      message: "Password changed successfully",
    };
  }

  async forgotPassword(
    data: ForgotPasswordInput
  ): Promise<ForgotPasswordResponse> {
    // Find user by email
    const user = await this._repository.findUserByEmail(data.email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        message:
          "If an account with this email exists, a password reset link has been sent",
      };
    }

    // In a real implementation, you would:
    // 1. Generate a secure reset token
    // 2. Store it with expiration time
    // 3. Send email with reset link
    // For now, we'll just return a success message

    return {
      message:
        "If an account with this email exists, a password reset link has been sent",
    };
  }

  async resetPassword(
    data: ResetPasswordInput
  ): Promise<ResetPasswordResponse> {
    // In a real implementation, you would verify the reset token
    // For now, we'll just update the password if user exists

    const user = await this._repository.findUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid reset request");
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(data.newPassword, saltRounds);

    // Update password
    await this._repository.updatePasswordByEmail(data.email, hashedNewPassword);

    return {
      message: "Password reset successfully",
    };
  }

  private generateToken(userId: number): string {
    // You should add JWT_SECRET to your environment configuration
    const secret = process.env.JWT_SECRET || "your-default-secret-key";
    return jwt.sign({ userId }, secret, { expiresIn: "24h" });
  }

  verifyToken(token: string): { userId: number } {
    const secret = process.env.JWT_SECRET || "your-default-secret-key";
    return jwt.verify(token, secret) as { userId: number };
  }
}
