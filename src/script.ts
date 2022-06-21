import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient();

async function main(){
   const allflashcard = await prisma.flashcard.findMany();
   console.log(allflashcard);
}

main().catch((e)=>{
    throw e;
}). finally(async ()=>{
    await prisma.$disconnect();
})