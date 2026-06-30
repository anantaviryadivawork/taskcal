import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("demo1234!", 12);

  const demo = await db.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db.task.deleteMany({ where: { userId: demo.id } });

  await db.task.createMany({
    data: [
      { title: "Review project requirements", description: "Go through the PDF and make notes", date: yesterday, status: "DONE", userId: demo.id },
      { title: "Set up development environment", description: "Install Node.js, configure database", date: yesterday, status: "DONE", userId: demo.id },
      { title: "Build authentication system", date: today, status: "IN_PROGRESS", userId: demo.id },
      { title: "Design database schema", description: "User and Task models with proper relations", date: today, status: "DONE", userId: demo.id },
      { title: "Implement calendar view", description: "Interactive monthly calendar with task indicators", date: today, status: "NOT_STARTED", userId: demo.id },
      { title: "Write unit tests", description: "Test auth actions and API routes", date: tomorrow, status: "NOT_STARTED", userId: demo.id },
      { title: "Deploy to Vercel", description: "Configure environment variables and run migrations", date: tomorrow, status: "NOT_STARTED", userId: demo.id },
    ],
  });

  console.log("Seed complete. Demo user: demo@example.com / demo1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
