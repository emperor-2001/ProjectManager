const mongoose = require("mongoose");
const connDB = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI);
  console.log(
    `MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold
  );
};

// console.log(connDB);
module.exports = connDB;
