import { TenantRepository } from "@repository/database";
import BaseService from "../BaseService";
import { CreateTenantInput, UpdateTenantInput } from "@requestType";
import { ForbiddenException, NotFoundException } from "@exceptions";

export default class TenantService extends BaseService<TenantRepository> {
  constructor() {
    super(new TenantRepository());
  }

  async createTenant(data: CreateTenantInput, createdById: number) {
    return this._repository.createTenant({ ...data, createdById });
  }

  async getTenantById(id: number) {
    const tenant = await this._repository.getTenantById(id);
    if (!tenant) {
      throw new NotFoundException("Tenant");
    }
    return tenant;
  }

  async getAllTenants() {
    return this._repository.getAllTenants();
  }

  async searchTenantsByName(searchTerm: string, dateOfBirth?: string) {
    return this._repository.searchTenantsByName(searchTerm, dateOfBirth);
  }

  async updateTenant(id: number, data: UpdateTenantInput, requesterId: number) {
    await this.assertOwner(id, requesterId);
    return this._repository.updateTenant(id, data);
  }

  async deleteTenant(id: number, requesterId: number) {
    await this.assertOwner(id, requesterId);
    return this._repository.deleteTenant(id);
  }

  // Only the landlord who reported a tenant may change or remove the report
  private async assertOwner(id: number, requesterId: number) {
    const tenant = await this.getTenantById(id);
    if (tenant.createdById !== requesterId) {
      throw new ForbiddenException("You can only modify tenants you reported.");
    }
  }
}
