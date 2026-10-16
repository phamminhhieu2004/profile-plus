const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixData() {
  console.log('--- Fixing Admin User Name ---');
  const user = await prisma.user.updateMany({
    where: {
      OR: [
        { username: 'phamminhhieu18022004' },
        { email: 'phamminhhieu18022004@gmail.com' },
      ],
    },
    data: {
      name: 'Phạm Minh Hiếu',
    },
  });
  console.log('Updated user records count:', user.count);

  console.log('--- Fixing Corrupted Blog Post ---');
  const post = await prisma.blogPost.updateMany({
    where: {
      id: '71dbef05-eaeb-4def-9025-d8ad09fa8f3e',
    },
    data: {
      title: 'Khởi đầu hành trình mới với Profile Plus',
      slug: 'khoi-dau-hanh-trinh-moi-voi-profile-plus',
      excerpt: 'Hôm nay mình chính thức ra mắt phiên bản mới của website cá nhân!',
      content: 'Chào mừng các bạn đến với blog của Hiếu. Nơi chia sẻ về công nghệ, backend và kỹ thuật ô tô!\n\nTại đây, mình sẽ thường xuyên cập nhật các bài viết phân tích chuyên sâu về kiến trúc hệ thống, Spring Boot, FastAPI, trí tuệ nhân tạo Gemini AI và hệ thống điều khiển điện tử ô tô (ECU / OBD-II).',
      tags: ['Chính thức', 'Profile Plus', 'Backend'],
      imageUrl: '/assets/picture1.jpg',
      featured: true,
    },
  });
  console.log('Updated blog post count:', post.count);

  console.log('--- Verifying Data ---');
  const updatedUser = await prisma.user.findFirst({
    where: { username: 'phamminhhieu18022004' },
    select: { id: true, username: true, name: true, role: true }
  });
  console.log('Verified User:', updatedUser);

  const updatedPosts = await prisma.blogPost.findMany({
    select: { id: true, title: true, tags: true, imageUrl: true }
  });
  console.log('Verified Posts:', updatedPosts);
}

fixData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
