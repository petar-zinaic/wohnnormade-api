import { Tenant } from "@prisma/client";
import UserRepository, {
  PublicUserWithTenants,
} from "@repository/database/UserRepository";
import { UpdateUserInput } from "@requestType/AuthTypes";
import {
  UserResponse,
  UserListResponse,
  TenantData,
} from "@responseType/UserTypes";
import {
  EmailAlreadyExistsException,
  ForbiddenException,
  NotFoundException,
} from "@exceptions";

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException("User");
    }
    return this.mapToUserResponse(user);
  }

  async getAllUsers(): Promise<UserListResponse[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map((user) => this.mapToUserListResponse(user));
  }

  async updateUser(
    id: number,
    userData: UpdateUserInput,
    requesterId: number
  ): Promise<UserResponse> {
    this.assertSelf(id, requesterId);

    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException("User");
    }

    // Check if email is being updated and if it already exists
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findUserByEmail(
        userData.email
      );
      if (userWithEmail) {
        throw new EmailAlreadyExistsException();
      }
    }

    const updatedUser = await this.userRepository.updateUser(id, userData);
    return this.mapToUserResponse(updatedUser);
  }

  async deleteUser(id: number, requesterId: number): Promise<void> {
    this.assertSelf(id, requesterId);

    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException("User");
    }

    // Tenants, communications and reset tokens are removed by ON DELETE CASCADE
    await this.userRepository.deleteUser(id);
  }

  // Users may only change their own account
  private assertSelf(id: number, requesterId: number) {
    if (id !== requesterId) {
      throw new ForbiddenException("You can only modify your own account.");
    }
  }

  // Accepts full user rows too; the password hash is never copied
  private mapToUserResponse(user: PublicUserWithTenants): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      city: user.city,
      country: user.country,
      tenants: this.mapTenantsToResponse(user.tenants),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapToUserListResponse(user: PublicUserWithTenants): UserListResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      city: user.city,
      country: user.country,
      tenants: this.mapTenantsToResponse(user.tenants),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapTenantsToResponse(tenants: Tenant[]): TenantData[] {
    return tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      surname: tenant.surname,
      dateOfBirth: tenant.dateOfBirth,
      violationType: tenant.violationType,
      description: tenant.description,
      city: tenant.city,
      country: tenant.country,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    }));
  }
}
