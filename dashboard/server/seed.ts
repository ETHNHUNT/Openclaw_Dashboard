import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");
  await prisma.task.deleteMany(); 

  await prisma.task.create({
    data: {
      title: 'Backend Integration',
      desc: 'Connect React frontend to Express/Prisma backend.',
      status: 'In Progress',
      priority: 'High',
      comments: {
        create: [
          { text: 'Initial setup done.' },
          { text: 'Wiring up fetch hooks.' }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      title: 'Database Schema Design',
      desc: 'Define Task and Log models in Prisma.',
      status: 'Done',
      priority: 'High',
    }
  });

  await prisma.task.create({
    data: {
      title: 'User Auth Module',
      desc: 'Implement JWT based auth for multi-user access.',
      status: 'Planning',
      priority: 'Medium',
    }
  });

  console.log('Database seeded!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
