import { PrismaClient } from './src/generated/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Connecting to database...');
    
    // Admin credentials
    const name = 'Administrador SAM';
    const email = 'admin@sam.local';
    const password = 'admin'; // match pgadmin default password
    const role = 'ADMIN';

    console.log(`Hashing password for ${email}...`);
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('Creating user in database...');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role as any,
        passwordHash,
      },
    });

    console.log('Admin user created successfully:');
    console.log(JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
