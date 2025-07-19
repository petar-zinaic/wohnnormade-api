import UserRepository from "../repositories/database/UserRepository";
import { UpdateUserInput } from "../types/request/AuthTypes";
import { UserResponse, UserListResponse } from "../types/response/UserTypes";
import InvalidIdException from "../utility/exceptions/BadRequest/InvalidIdException";

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new InvalidIdException();
    }
    return this.mapToUserResponse(user);
  }

  async getAllUsers(): Promise<UserListResponse[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map((user: any) => this.mapToUserListResponse(user));
  }

  async updateUser(
    id: number,
    userData: UpdateUserInput
  ): Promise<UserResponse> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new InvalidIdException();
    }

    // Check if email is being updated and if it already exists
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findUserByEmail(
        userData.email
      );
      if (userWithEmail) {
        throw new Error("User with this email already exists");
      }
    }

    const updatedUser = await this.userRepository.updateUser(id, userData);
    return this.mapToUserResponse(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new InvalidIdException();
    }

    await this.userRepository.deleteUser(id);
  }

  private mapToUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      city: user.city,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapToUserListResponse(user: any): UserListResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      city: user.city,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
