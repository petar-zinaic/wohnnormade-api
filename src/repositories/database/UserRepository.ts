import BaseRepository from "./BaseRepository";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput,
  CreateUserInput,
  UpdateUserInput,
} from "@requestType/AuthTypes";

export default class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  async findUserByEmail(email: string): Promise<any | null> {
    return await this.prismaClient.user.findUnique({
      where: { email },
      include: {
        tenants: true,
      },
    });
  }

  async findUserById(id: number): Promise<any | null> {
    return await this.prismaClient.user.findUnique({
      where: { id },
      include: {
        tenants: true,
      },
    });
  }

  async createUser(
    userData: RegisterInput & { password: string }
  ): Promise<any> {
    return await this.prismaClient.user.create({
      data: {
        email: userData.email,
        password: userData.password,
      },
    });
  }

  async createUserWithDetails(
    userData: CreateUserInput & { password: string }
  ): Promise<any> {
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

  async updateUser(userId: number, userData: UpdateUserInput): Promise<any> {
    return await this.prismaClient.user.update({
      where: { id: userId },
      data: userData,
      include: {
        tenants: true,
      },
    });
  }

  async deleteUser(userId: number): Promise<any> {
    return await this.prismaClient.user.delete({
      where: { id: userId },
    });
  }

  async getAllUsers(): Promise<any[]> {
    return await this.prismaClient.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        city: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        tenants: true,
      },
    });
  }

  async updateUserPassword(
    userId: number,
    hashedPassword: string
  ): Promise<any> {
    return await this.prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updatePasswordByEmail(
    email: string,
    hashedPassword: string
  ): Promise<any> {
    return await this.prismaClient.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }
}
