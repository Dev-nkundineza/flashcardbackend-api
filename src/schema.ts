import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './graphql/flashcard'
import * as usertypes from './graphql/users'
import * as authTypes from './graphql/authFolder'

export const schema = makeSchema({
  types : [usertypes, types, authTypes], 
  outputs: {
    schema: join(process.cwd(), 'schema.graphql'),
    typegen: join(process.cwd(), 'nexus-typegen.ts'),
  },
  contextType: {
    module: join(process.cwd(), './src/context.ts'),
    export: 'Context',
  },
});