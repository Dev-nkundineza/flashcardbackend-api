"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardMutation = exports.FlashcardQuery = exports.AllFlashcards = exports.Sort = exports.FlashcardOrderByInput = exports.Flashcard = void 0;
const nexus_1 = require("nexus");
exports.Flashcard = (0, nexus_1.objectType)({
    name: 'Flashcard',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('question');
        t.nonNull.string('answer');
        t.nonNull.boolean('isDone');
        t.field('postedBy', {
            type: 'User',
            resolve(parent, args, context) {
                return context.prisma.flashcard
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
    },
});
exports.FlashcardOrderByInput = (0, nexus_1.inputObjectType)({
    name: 'FlashcardOrderByInput',
    definition(t) {
        t.field('question', { type: exports.Sort });
        t.field('answer', { type: exports.Sort });
        t.field('createdAt', { type: exports.Sort });
    },
});
exports.Sort = (0, nexus_1.enumType)({
    name: 'Sort',
    members: ['asc', 'desc'],
});
exports.AllFlashcards = (0, nexus_1.objectType)({
    name: 'AllFlashcards',
    definition(t) {
        t.nonNull.list.nonNull.field('flashcards', { type: exports.Flashcard });
        t.nonNull.int('count');
        t.id('id');
    },
});
exports.FlashcardQuery = (0, nexus_1.extendType)({
    type: 'Query',
    definition(t) {
        t.nonNull.field('flashcards', {
            type: 'AllFlashcards',
            args: {
                filter: (0, nexus_1.stringArg)(),
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.intArg)(),
                orderBy: (0, nexus_1.arg)({ type: (0, nexus_1.list)((0, nexus_1.nonNull)(exports.FlashcardOrderByInput)) }),
            },
            async resolve(parent, args, context) {
                let flashcards;
                let count;
                if (args.filter === 'true' || args.filter === 'false') {
                    const isDone = args.filter === 'true' ? true : false;
                    flashcards = context.prisma.flashcard.findMany({
                        where: { isDone },
                        skip: args === null || args === void 0 ? void 0 : args.skip,
                        take: args === null || args === void 0 ? void 0 : args.take,
                        orderBy: args === null || args === void 0 ? void 0 : args.orderBy,
                    });
                    count = await context.prisma.flashcard.count({ where: { isDone } });
                }
                else {
                    const where = args.filter
                        ? {
                            OR: [
                                { question: { contains: args.filter } },
                                { answer: { contains: args.filter } },
                            ],
                        }
                        : {};
                    flashcards = context.prisma.flashcard.findMany({
                        where,
                        skip: args === null || args === void 0 ? void 0 : args.skip,
                        take: args === null || args === void 0 ? void 0 : args.take,
                        orderBy: args === null || args === void 0 ? void 0 : args.orderBy,
                    });
                    count = await context.prisma.flashcard.count({ where });
                }
                const id = `main-query:${JSON.stringify(args)}`;
                return {
                    flashcards,
                    count,
                    id,
                };
            },
        });
    },
});
exports.FlashcardMutation = (0, nexus_1.extendType)({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createFlashcard', {
            type: 'Flashcard',
            args: {
                question: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                answer: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(parent, args, context) {
                const { question, answer } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error('Cannot create flashcard without logging in.');
                }
                const newFlashcard = context.prisma.flashcard.create({
                    data: {
                        question,
                        answer,
                        postedBy: { connect: { id: userId } },
                    },
                });
                return newFlashcard;
            },
        });
        t.nonNull.field('updateFlashcard', {
            type: 'Flashcard',
            args: {
                question: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                answer: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                isDone: (0, nexus_1.nullable)((0, nexus_1.booleanArg)()),
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(parent, args, context) {
                const { question, answer, isDone, id } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error('Cannot update flashcard without logging in.');
                }
                const newFlashcard = context.prisma.flashcard.update({
                    where: { id },
                    data: {
                        ...(question && { question }),
                        ...(answer && { answer }),
                        ...(isDone != null && { isDone }),
                    },
                });
                return newFlashcard;
            },
        });
        t.nonNull.field('deleteFlashcard', {
            type: 'Flashcard',
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve(parent, args, context) {
                const { id } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error('Cannot delete flashcard without logging in.');
                }
                return context.prisma.flashcard.delete({
                    where: { id },
                });
            },
        });
    },
});
//# sourceMappingURL=Fashcard.js.map