import prismaClient from '@/lib/clients/prisma-client';

export async function getAllLabels() {
  const labels = await prismaClient.label.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, color: true },
  });

  return { data: labels };
}
