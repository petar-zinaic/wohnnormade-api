import { Prisma } from "@prisma/client";
import BaseRepository from "./BaseRepository";
import { CreateTenantInput, UpdateTenantInput } from "@requestType";
import { ExistingTenantException } from "@utility/exceptions";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default class TenantRepository extends BaseRepository {
  constructor() {
    super();
  }

  public async createTenant(
    data: CreateTenantInput & { createdById: number }
  ) {
    try {
      const tenant = await this.prismaClient.tenant.create({
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

      return tenant;
    } catch (error) {
      // Only a unique constraint violation means the tenant already exists
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ExistingTenantException();
      }

      throw error;
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

  public async searchTenantsByName(searchTerm: string, dateOfBirth?: string) {
    try {
      // Split the search term into words
      const searchWords = searchTerm
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const whereConditions: Prisma.TenantWhereInput[] = [];

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

      // Build the where clause
      const whereClause: Prisma.TenantWhereInput = {
        OR: whereConditions,
      };

      // Add date of birth filter if provided
      if (dateOfBirth) {
        const searchDate = new Date(dateOfBirth);
        // Match the whole calendar day in UTC, the same way dates are stored
        const startOfDay = new Date(
          Date.UTC(
            searchDate.getUTCFullYear(),
            searchDate.getUTCMonth(),
            searchDate.getUTCDate()
          )
        );
        const startOfNextDay = new Date(startOfDay.getTime() + ONE_DAY_MS);

        whereClause.AND = [
          whereClause.OR ? { OR: whereClause.OR } : {},
          {
            dateOfBirth: {
              gte: startOfDay,
              lt: startOfNextDay,
            },
          },
        ];
        delete whereClause.OR;
      }

      const tenants = await this.prismaClient.tenant.findMany({
        where: whereClause,
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

  public async updateTenant(id: number, data: UpdateTenantInput) {
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
      // Related communications are removed by the database (ON DELETE CASCADE)
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
