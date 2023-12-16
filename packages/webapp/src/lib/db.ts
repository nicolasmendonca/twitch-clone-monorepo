import { env } from '$env/dynamic/private';
import pkg, { PrismaClient } from '@prisma/client';

declare global {
	var _prisma: PrismaClient; // eslint-disable-line
}

let prisma: PrismaClient;
if (env.NODE_ENV === 'development') {
	if (!globalThis._prisma) {
		globalThis._prisma = new PrismaClient();
	}
	prisma = globalThis._prisma;
} else {
	const { PrismaClient: PrismaClientProd } = pkg;
	prisma = new PrismaClientProd();
}

export { prisma };
