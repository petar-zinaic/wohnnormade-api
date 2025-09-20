import { TennantRepository } from "src/repositories/database";
import BaseService from "../BaseService";
import { CreateTennantInput, UpdateTennantInput } from "@requestType";

export default class TenantService extends BaseService<TennantRepository> {
  constructor() {
    super(new TennantRepository());
  }

  async createTanant(data: CreateTennantInput, createdById: number) {
    return this._repository.createTennant({ ...data, createdById });
  }

  async getTenantById(id: number) {
    return this._repository.getTenantById(id);
  }

  async getAllTenants() {
    return this._repository.getAllTenants();
  }

  async searchTenantsByName(searchTerm: string) {
    return this._repository.searchTenantsByName(searchTerm);
  }

  async updateTenant(id: number, data: UpdateTennantInput) {
    return this._repository.updateTenant(id, data);
  }

  async deleteTenant(id: number) {
    return this._repository.deleteTenant(id);
  }
}
