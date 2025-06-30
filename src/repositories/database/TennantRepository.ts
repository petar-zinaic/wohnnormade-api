import BaseRepository from "./BaseRepository";
import { CreateTennantInput } from "@requestType";
import { ExistingTennantException } from "@utility/exceptions";

export default class TennantRepository extends BaseRepository {
  constructor() {
    super();
  }

  public async createTennant(
    data: CreateTennantInput & { createdById: number }
  ) {
    try {
      const tennant = await this.prismaClient.tenant.create({
        data,
      });

      return tennant;
    } catch (error) {
      throw new ExistingTennantException();
    }
  }
}
