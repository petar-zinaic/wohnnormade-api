import { TennantRepository } from 'src/repositories/database';
import BaseService from '../BaseService';
import { CreateTennantInput } from '@requestType';

export default class ContributeService extends BaseService<TennantRepository> {
  constructor() {
    super(new TennantRepository())
  }

  async createTanant(data: CreateTennantInput) {
    return this._repository.createTennant(data)
  }
}
