import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { CONFIG } from '@/constants';

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: CONFIG.DATABASE_URL });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prismaClient;
}

export default prismaClient;
