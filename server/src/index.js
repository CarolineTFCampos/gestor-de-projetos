const { Prisma } = require('prisma-binding')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = require('./resolvers')

const teamwork = require('./teamwork')

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: process.env.PRISMA_ENDPOINT // the endpoint of the Prisma API (value set in `.env`)
  // debug: true // log all GraphQL queries & mutations sent to the Prisma API
  // secret: process.env.PRISMA_SECRET, // only needed if specified in `database/prisma.yml` (value set in `.env`)
})

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: function(req) {
    return {
      ...req,
      teamwork,
      prisma
    }
  }
})

server.start(() => console.log('Server is running on http://localhost:4000'))
