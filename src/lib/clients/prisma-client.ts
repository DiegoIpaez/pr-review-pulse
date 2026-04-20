import { PrismaPg } from '@prisma/adapter-pg';
import { CONFIG } from '@/constants';
import { PrismaClient } from '@/generated/prisma/client';

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: CONFIG.DATABASE_URL });
  return new PrismaClient({ adapter });
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Required for the Prisma singleton in development
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prismaClient;
}

export default prismaClient;
