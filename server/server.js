const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

// demo todos contents
let todos = [
  {
    id: Date.now().toString(),
    text: 'Hello from GraphQL',
    description: "this is first desc",
    completed: true,
  },
];

// demo service contents
let services = [
  {
    id: Date.now().toString(),
    title: '',
    content:''
  }
]


const typeDefs = gql`
  type Todo {
    id: String
    text: String
    description: String
    completed: Boolean
  }
  type Service {
    id: String
    title: String
    content:String
  }
  type Query {
    todos: [Todo]!
    services: [Service]!
  }
  type Mutation {
    createTodo(text: String!, description: String!):String
    removeTodo(id: String!):String
    updateTodo(id: String!):String
    createService(title: String!, content: String!):String
    removeService(id: String!):String
    updateService(id: String!):String
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    services:() => services
  },
  Mutation: {
    // todo mutation
    createTodo: (parent, args, context, info) => {
      return todos.push({
        id: Date.now().toString(),
        text: args.text,
        description: args.description,
        completed: false,
      });
    },
    removeTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      return args.id;
    },
    updateTodo: (parent, args, context, info) => { 
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos[i].completed = !todos[i].completed;
        }
      }
      return args.id;
    },
    // service mutation
    createService:(parent, args, context, info) =>{
      return services.push({
        id: Date.now().toString(),
        title: args.title,
        content: args.content
      })
    },
    removeService: (parent, args, context, info) => {
      for (let i in services) {
        if (services[i].id === args.id) {
          services.splice(i, 1);
        }
      }
      return args.id;
    },
    updateService: (parent, args, context, info) => { 
      for (let i in services) {
        if (services[i].id === args.id) {
          services[i].completed = !services[i].completed;
        }
      }
      return args.id;
    },


  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);