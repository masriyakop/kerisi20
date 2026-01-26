import { PrismaClient as PrismaClient2 } from "../../node_modules/.prisma/client2/index.js";

const prisma2ClientSingleton = () => {
  return new PrismaClient2();
};

declare global {
  var prisma2: undefined | ReturnType<typeof prisma2ClientSingleton>;
}

const prisma2 = globalThis.prisma2 ?? prisma2ClientSingleton();

export default prisma2;

if (process.env.NODE_ENV !== "production") globalThis.prisma2 = prisma2;
