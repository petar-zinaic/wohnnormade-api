import { TennantRepository } from "src/repositories/database";
import BaseService from "../BaseService";
import { CreateTennantInput } from "@requestType";

export default class ContributeService extends BaseService<TennantRepository> {
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
}
