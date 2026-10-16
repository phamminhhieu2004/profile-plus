const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showPost() {
  const p = await prisma.blogPost.findUnique({
    where: { id: '71dbef05-eaeb-4def-9025-d8ad09fa8f3e' }
  });
  console.log(JSON.stringify(p, null, 2));
}

showPost()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
