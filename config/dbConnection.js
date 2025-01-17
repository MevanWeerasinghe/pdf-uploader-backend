const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONECTION_STRING);
    console.log(
      `MongoDB Connected: ${conn.connection.host} : ${conn.connection.name}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
