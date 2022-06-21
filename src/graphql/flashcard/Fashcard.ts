import { Prisma } from '@prisma/client';

import {
  arg,
  booleanArg,
  enumType,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';

export const Flashcard = objectType({
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

export const FlashcardOrderByInput = inputObjectType({
  name: 'FlashcardOrderByInput',

  definition(t) {
    t.field('question', { type: Sort });

    t.field('answer', { type: Sort });

    t.field('createdAt', { type: Sort });
  },
});

export const Sort = enumType({
  name: 'Sort',

  members: ['asc', 'desc'],
});

export const AllFlashcards = objectType({
  name: 'AllFlashcards',

  definition(t) {
    t.nonNull.list.nonNull.field('flashcards', { type: Flashcard });

    t.nonNull.int('count');

    t.id('id');
  },
});

export const FlashcardQuery = extendType({
  type: 'Query',

  definition(t) {
    t.nonNull.field('flashcards', {
      type: 'AllFlashcards',

      args: {
        filter: stringArg(),

        skip: intArg(),

        take: intArg(),

        orderBy: arg({ type: list(nonNull(FlashcardOrderByInput)) }),
      },

      async resolve(parent, args, context) {
        let flashcards;

        let count;

        if (args.filter === 'true' || args.filter === 'false') {
          const isDone = args.filter === 'true' ? true : false;

          flashcards = context.prisma.flashcard.findMany({
            where: { isDone },

            skip: args?.skip as number | undefined,

            take: args?.take as number | undefined,

            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.FlashcardOrderByWithRelationInput>
              | undefined,
          });

          count = await context.prisma.flashcard.count({ where: { isDone } });
        } else {
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

            skip: args?.skip as number | undefined,

            take: args?.take as number | undefined,

            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.FlashcardOrderByWithRelationInput>
              | undefined,
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

export const FlashcardMutation = extendType({
  type: 'Mutation',

  definition(t) {
    t.nonNull.field('createFlashcard', {
      type: 'Flashcard',

      args: {
        question: nonNull(stringArg()),

        answer: nonNull(stringArg()),
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
        question: nullable(stringArg()),

        answer: nullable(stringArg()),

        isDone: nullable(booleanArg()),

        id: nonNull(intArg()),
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
        id: nonNull(intArg()),
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
