require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

const isTesting = process.env.NODE_ENV === 'test' || !!process.env.VITEST;

let prisma;

if (isTesting) {
    prisma = {};
} else {
    prisma = globalForPrisma.prisma || new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prisma;
    }
}

module.exports = prisma;