import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('🌱 Executando seed no banco de dados...');

    const email = 'admin@sam.local';
    const password = 'admin@sam123';
    const name = 'Administrador SAM';

    console.log(`Criando hash da senha para o administrador (${email})...`);
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: 'ADMIN',
        active: true,
        mustChangePassword: false,
        resetRequested: false,
      },
      create: {
        name,
        email,
        role: 'ADMIN',
        passwordHash,
        active: true,
        mustChangePassword: false,
        resetRequested: false,
      },
    });

    // Atualiza qualquer outro usuário administrador existente para a mesma nova senha
    const otherAdmins = await prisma.user.updateMany({
      where: {
        role: 'ADMIN',
        NOT: { email },
      },
      data: {
        passwordHash,
        active: true,
        mustChangePassword: false,
        resetRequested: false,
      },
    });

    console.log('✅ Usuário administrador atualizado/criado com sucesso:');
    console.log({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active,
    });

    if (otherAdmins.count > 0) {
      console.log(`✅ Outros ${otherAdmins.count} usuários administradores também tiveram suas senhas atualizadas.`);
    }
  } catch (error) {
    console.error('❌ Erro ao executar o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
