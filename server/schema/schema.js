// const { projects, clients } = require("../sampleData");

const Project = require("../model/projects");
const Client = require("../model/clients");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

// Client Type Object
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    // field is a function that return the object we want to make
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});
//Project Type Object
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => {
    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      client: {
        type: ClientType,
        resolve(parent, args) {
          return Client.find(parent.clientId);
        }, // adding relationship between client and project
      },
    };
  },
});

// to resolve queries we will create rootQuery type

const rootQuery = new GraphQLObjectType({
  name: "rootQueryType",
  fields: {
    // here fields represents different queries that we can resolve
    client: {
      type: ClientType, // type of data we are going to return
      args: { id: { type: GraphQLID } }, // arguments that we need to pass to resolve the query
      resolve(parent, args) {
        // resolve function is used to get data from db or other source
        // code to get data from db also it resolves the query
        // parent is object that contains data from previous query
        return Client.find(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    project: {
      type: ProjectType, // type of data we are going to return
      args: { id: { type: GraphQLID } }, // arguments that we need to pass to resolve the query
      resolve(parent, args) {
        return Project.find(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
});
