const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, name: true, role: true }
  });
  console.log('=== USERS ===');
  for (const u of users) {
    console.log(`ID: ${u.id} | User: ${u.username} | Email: ${u.email} | Name: "${u.name}" | Role: ${u.role}`);
  }

  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, excerpt: true, tags: true, imageUrl: true }
  });
  console.log('\n=== POSTS ===');
  for (const p of posts) {
    console.log(`ID: ${p.id} | Title: "${p.title}" | Tags: ${JSON.stringify(p.tags)} | Img: ${p.imageUrl}`);
    console.log(`Excerpt: "${p.excerpt}"\n`);
  }
}

inspect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
