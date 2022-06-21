"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const apollo_server_1 = require("apollo-server");
const context_1 = require("./context");
// 1
const schema_1 = require("./schema");
exports.server = new apollo_server_1.ApolloServer({
    schema: schema_1.schema,
    context: context_1.context,
});
const port = 3000;
// 2
exports.server.listen({ port }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map