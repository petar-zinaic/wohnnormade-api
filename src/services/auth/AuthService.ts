import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BaseService from "../BaseService";
import EmailService from "@services/EmailService";
import UserRepository from "@repository/database/UserRepository";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput,
  ForgotPasswordInput,
} from "@requestType/AuthTypes";
import {
  RegisterResponse,
  LoginResponse,
  ChangePasswordResponse,
  ResetPasswordResponse,
  ForgotPasswordResponse,
} from "@responseType/AuthTypes";
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  InvalidResetTokenException,
  NotFoundException,
} from "@exceptions";
import envConfig from "@config/environment";

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MINUTES = 60;
const FORGOT_PASSWORD_MESSAGE =
  "If an account with this email exists, a password reset link has been sent";

export default class AuthService extends BaseService<UserRepository> {
  private emailService: EmailService;

  constructor() {
    super(new UserRepository());
    this.emailService = new EmailService();
  }

  async register(data: RegisterInput): Promise<RegisterResponse> {
    // Check if user already exists
    const existingUser = await this._repository.findUserByEmail(data.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

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
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
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
      throw new NotFoundException("User");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new InvalidCredentialsException("Current password is incorrect.");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

    // Update password
    await this._repository.updateUserPassword(userId, hashedNewPassword);

    return {
      message: "Password changed successfully",
    };
  }

  async forgotPassword(
    data: ForgotPasswordInput
  ): Promise<ForgotPasswordResponse> {
    // Same response whether or not the email exists, so accounts can't be discovered
    const user = await this._repository.findUserByEmail(data.email);
    if (!user) {
      return { message: FORGOT_PASSWORD_MESSAGE };
    }

    // Only one active reset link per user
    await this._repository.deleteUnusedResetTokensForUser(user.id);

    // Store only the hash; the raw token exists only in the email link
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
    await this._repository.createResetToken(
      user.id,
      this.hashResetToken(resetToken),
      expiresAt
    );

    try {
      await this.emailService.sendPasswordReset({
        recipient: { name: user.name || undefined, email: user.email },
        resetToken,
        expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
    }

    return { message: FORGOT_PASSWORD_MESSAGE };
  }

  async resetPassword(
    data: ResetPasswordInput
  ): Promise<ResetPasswordResponse> {
    const resetToken = await this._repository.findResetTokenByHash(
      this.hashResetToken(data.token)
    );

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() < Date.now()
    ) {
      throw new InvalidResetTokenException();
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

    // Update password and mark the token used in one transaction
    await this._repository.resetPasswordWithToken(
      resetToken.id,
      resetToken.userId,
      hashedNewPassword
    );

    return {
      message: "Password reset successfully",
    };
  }

  private hashResetToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, envConfig.auth.jwtSecret, { expiresIn: "24h" });
  }

  verifyToken(token: string): { userId: number } {
    return jwt.verify(token, envConfig.auth.jwtSecret) as { userId: number };
  }
}
