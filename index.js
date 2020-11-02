const { ApolloServer, gql} = require('apollo-server');
const uuid = require('uuid/v4');

require('dotenv').config();

const typeDefs = gql`
    type Quote {
        id: ID!
        phrase: String!
        author: String
    }
    type Authentication {
        token: String!
    }
    type Query {
        quotes: [Quote]
    }
    type Mutation {
        addQuote(phrase: String!, author: String): Quote
        editQuote(id: ID!, phrase: String, author: String): Quote
        deleteQuote(id: ID!): DeleteResponse
    }
    type DeleteResponse{
        deleted: Boolean!
    }
    `;
    
    const quotes = {};
    const addQuote = quote => {
        const id = uuid();
        return quotes[id] = {...quote, id};
    };

    //Testing Quotes
    addQuote({ phrase: 'The people who are crazy enough to think they can change the world are the ones who do.', author: 'Steve Jobs'})
    addQuote({ phrase: 'Sometimes life is going to hit you in the head with a brick. Dont lose faith.', author: 'Steve Jobs'})
    addQuote({ phrase: 'When something is important enought, you do it even if the odds are not in your favor', author: 'Elon Must'})

    const resolvers = {
        Query: {
            quotes: () => Object.values(quotes),
        },
        Mutation: {
            addQuote: async (parent, quote) => {
                return addQuote(quote);
            },
            editQuote: async(parent, {id, ...quote }) => {
                if(!quote[id]) {
                    throw new Error('Quote do not exist');
                }

                quotes[id] = {
                    ...quotes[id],
                    ...quote
                };

                return quotes[id]
            },
            deleteQuote: async (parent, { id }) => {
                const deleted = Boolean(quotes[id]);
                delete quotes[id]

                return { deleted }
            }
        }
    };

    const server = new ApolloServer({ typeDefs, resolvers});

    server.listen().then(({ url }) => {
        console.log(`Server ready at ${url}`)
    })