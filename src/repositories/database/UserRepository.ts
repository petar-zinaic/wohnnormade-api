import BaseRepository from "./BaseRepository";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput,
} from "../../types/request/AuthTypes";

export default class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  async findUserByEmail(email: string): Promise<any | null> {
    return await this.prismaClient.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: number): Promise<any | null> {
    return await this.prismaClient.user.findUnique({
      where: { id },
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
