const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Database {
    static prisma = prisma;

    static connect = async () => {
        try {
            // koi explicit connect method nahi hota PrismaClient me
            console.log("Prisma Client ready to use.");
            return prisma;
        } catch (error) {
            console.error("Prisma connection error:", error);
            process.exit(1);
        }
    }
}

module.exports = Database;
