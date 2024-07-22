import BaseRepository from "../../repositories/BaseRepository";

export default class ContributeService extends BaseRepository {
  async createTanant(): Promise<string> {
    return "working";
  }
}
