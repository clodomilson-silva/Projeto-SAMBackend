import { PrismaClient } from './src/generated/prisma';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Connecting to database...');
    const users = await prisma.user.findMany();
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
