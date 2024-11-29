import BaseRepository from "../../repositories/BaseRepository";

export default class ContributeService extends BaseRepository {
  async createTanant(data: any): Promise<string> {
    return "working";
  }
}
