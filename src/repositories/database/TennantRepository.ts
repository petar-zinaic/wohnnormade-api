import BaseRepository from "./BaseRepository";
import { CreateTennantInput, UpdateTennantInput } from "@requestType";
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

  public async searchTenantsByName(searchTerm: string) {
    try {
      // Split the search term into words
      const searchWords = searchTerm
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const whereConditions: any[] = [];

      if (searchWords.length === 1) {
        // Single word: search in both name and surname
        const word = searchWords[0];
        whereConditions.push(
          {
            name: {
              contains: word,
              mode: "insensitive",
            },
          },
          {
            surname: {
              contains: word,
              mode: "insensitive",
            },
          }
        );
      } else if (searchWords.length >= 2) {
        // Multiple words: create combinations
        const [firstName, ...restWords] = searchWords;
        const lastName = restWords.join(" ");

        // Search for first word in name and rest in surname
        whereConditions.push({
          AND: [
            {
              name: {
                contains: firstName,
                mode: "insensitive",
              },
            },
            {
              surname: {
                contains: lastName,
                mode: "insensitive",
              },
            },
          ],
        });

        // Search for first word in surname and rest in name
        whereConditions.push({
          AND: [
            {
              surname: {
                contains: firstName,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: lastName,
                mode: "insensitive",
              },
            },
          ],
        });

        // Search for each word individually in both fields
        searchWords.forEach((word) => {
          whereConditions.push(
            {
              name: {
                contains: word,
                mode: "insensitive",
              },
            },
            {
              surname: {
                contains: word,
                mode: "insensitive",
              },
            }
          );
        });
      }

      const tenants = await this.prismaClient.tenant.findMany({
        where: {
          OR: whereConditions,
        },
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

  public async updateTenant(id: number, data: UpdateTennantInput) {
    try {
      const updatedTenant = await this.prismaClient.tenant.update({
        where: { id },
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

      return updatedTenant;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTenant(id: number) {
    try {
      const deletedTenant = await this.prismaClient.tenant.delete({
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

      return deletedTenant;
    } catch (error) {
      throw error;
    }
  }
}
