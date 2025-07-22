const { GraphQLServer } = require("graphql-yoga");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

module.exports = (done = () => {}) => {
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
  });

  server.start(
    {
      bodyParserOptions: { limit: "50mb", type: "application/json" },
      // cors: {
      //   credentials: true,
      //   origin: ["http://localhost:3000"],
      // },
    },
    ({ port }) => {
      console.log(
        `👷‍ [Editor Graph API]: Listening on http://localhost:${port}/`
      );
      done(port);
    }
  );
};
