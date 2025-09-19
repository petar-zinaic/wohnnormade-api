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
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      return tennant;
    } catch (error) {
      throw new ExistingTennantException();
    }
  }

  public async getTenantById(id: number) {
    try {
      const tenant = await this.prismaClient.tenant.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      return tenant;
    } catch (error) {
      throw error;
    }
  }

  public async getAllTenants() {
    try {
      const tenants = await this.prismaClient.tenant.findMany({
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              name: true,
              surname: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return tenants;
    } catch (error) {
      throw error;
    }
  }
}
