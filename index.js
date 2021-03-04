const mongoose = require('mongoose')
const { ApolloServer, PubSub } = require('apollo-server')

const { DB_URL } = require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const pubsub = new PubSub()

const PORT = process.env.port || 4000

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({req, pubsub}) })

// The `listen` method launches a web server.
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('DB connect')
        return server.listen(PORT)
    })
    .then(({ url }) => console.log(`Server running at ${url}`))
    .catch(err => {
        console.error(err)
    })