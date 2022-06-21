"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const allflashcard = await prisma.flashcard.findMany();
    console.log(allflashcard);
}
main().catch((e) => {
    throw e;
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=script.js.map