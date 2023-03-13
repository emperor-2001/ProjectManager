const express = require("express");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const mySchema = require("./schema/schema");
const colors = require("colors");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db.js");

connectDB();
//mongoose models
const Client = require("./model/clients");
const Project = require("./model/projects");
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: mySchema,
    graphiql: process.env.NODE_ENV === "development",
  })
);
app.listen(port, () => console.log(`The server is running on port ${port}`));

// we can make queries through graphiql which is like postman which we use in restapi and it is located at localhost:8000/graphql since here port is 8000
