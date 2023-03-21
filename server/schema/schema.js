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
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
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
          return Client.findById(parent.clientId);
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

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    // add client mutation
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const newClient = await Client.create({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return newClient;
      },
    },

    //delete a client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return Client.findByIdAndDelete(args.id);
      },
    },
    // delete project mutation
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return Project.findByIdAndDelete(args.id);
      },
    },

    //update Project mutation
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjecteStatus",
            values: {
              progess: { value: "In Progress" },
              done: { value: "Completed" },
              new: { value: "Not Started" },
            },
            default: "Not Started",
          }),
        },
        clientId: { type: GraphQLID },
      },
      async resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
          },
          { new: true }
        );
      },
    },
    // add a Project Mutation
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              progess: { value: "In Progress" },
              done: { value: "Completed" },
              new: { value: "Not Started" },
            },
            default: "Not Started",
          }),
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const newProject = await Project.create({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return newProject;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation,
});
