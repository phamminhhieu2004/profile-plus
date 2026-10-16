const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash('Hieu18022004@', 12);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: 'phamminhhieu18022004' },
        { email: 'phamminhhieu18022004@gmail.com' },
      ],
    },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        username: 'phamminhhieu18022004',
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Phạm Minh Hiếu',
      },
    });
    console.log('SUCCESS: Admin user updated:', updated.username, updated.role, updated.email);
  } else {
    const created = await prisma.user.create({
      data: {
        username: 'phamminhhieu18022004',
        email: 'phamminhhieu18022004@gmail.com',
        password: hashedPassword,
        name: 'Phạm Minh Hiếu',
        role: 'ADMIN',
        avatar: '/assets/avatar.png',
      },
    });
    console.log('SUCCESS: Admin user created:', created.username, created.role);
  }

  await prisma.$disconnect();
}

seedAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
