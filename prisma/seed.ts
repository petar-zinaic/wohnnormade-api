import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

// Local development login for the seeded tenants
const SEED_USER = {
  email: "seed.landlord@example.com",
  password: "seed-password-123",
  name: "Seed",
  surname: "Landlord",
  city: "Graz",
  country: "Austria",
};

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function upsertSeedUser() {
  const password = await bcrypt.hash(SEED_USER.password, 10);

  return prisma.user.upsert({
    where: { email: SEED_USER.email },
    update: {},
    create: { ...SEED_USER, password },
  });
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "tenant.json",
  ];

  await deleteAllData(orderedFileNames);

  // Every tenant needs a reporting landlord (createdById)
  const seedUser = await upsertSeedUser();
  console.log(`Seed user: ${seedUser.email}`);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      // Drop fixed ids so the autoincrement sequence stays in sync
      for (const { id, ...data } of jsonData) {
        await model.create({ data: { ...data, createdById: seedUser.id } });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
