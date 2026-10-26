import { PasswordResetToken, Prisma, User } from "@prisma/client";
import BaseRepository from "./BaseRepository";
import { CreateUserInput, UpdateUserInput } from "@requestType/AuthTypes";

export type UserWithTenants = Prisma.UserGetPayload<{
  include: { tenants: true };
}>;

// Every field except the password hash
const publicUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  surname: true,
  city: true,
  country: true,
  createdAt: true,
  updatedAt: true,
  tenants: true,
});

export type PublicUserWithTenants = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export default class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  async findUserByEmail(email: string): Promise<UserWithTenants | null> {
    return await this.prismaClient.user.findUnique({
      where: { email },
      include: {
        tenants: true,
      },
    });
  }

  async findUserById(id: number): Promise<UserWithTenants | null> {
    return await this.prismaClient.user.findUnique({
      where: { id },
      include: {
        tenants: true,
      },
    });
  }

  async createUserWithDetails(
    userData: CreateUserInput & { password: string }
  ): Promise<User> {
    return await this.prismaClient.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        surname: userData.surname,
        city: userData.city,
        country: userData.country,
      },
    });
  }

  async updateUser(
    userId: number,
    userData: UpdateUserInput
  ): Promise<UserWithTenants> {
    // Copy only editable profile fields so password or id can never be set here
    const { email, name, surname, city, country } = userData;

    return await this.prismaClient.user.update({
      where: { id: userId },
      data: { email, name, surname, city, country },
      include: {
        tenants: true,
      },
    });
  }

  async deleteUser(userId: number): Promise<User> {
    return await this.prismaClient.user.delete({
      where: { id: userId },
    });
  }

  async getAllUsers(): Promise<PublicUserWithTenants[]> {
    return await this.prismaClient.user.findMany({
      select: publicUserSelect,
    });
  }

  async updateUserPassword(
    userId: number,
    hashedPassword: string
  ): Promise<User> {
    return await this.prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async createResetToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date
  ): Promise<PasswordResetToken> {
    return await this.prismaClient.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findResetTokenByHash(
    tokenHash: string
  ): Promise<PasswordResetToken | null> {
    return await this.prismaClient.passwordResetToken.findUnique({
      where: { tokenHash },
    });
  }

  async deleteUnusedResetTokensForUser(userId: number): Promise<void> {
    await this.prismaClient.passwordResetToken.deleteMany({
      where: { userId, usedAt: null },
    });
  }

  async resetPasswordWithToken(
    tokenId: number,
    userId: number,
    hashedPassword: string
  ): Promise<void> {
    await this.prismaClient.$transaction([
      this.prismaClient.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      }),
      this.prismaClient.passwordResetToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      }),
    ]);
  }
}
