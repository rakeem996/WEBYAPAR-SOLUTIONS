const mongoose = require("mongoose");


const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_PORT, {
    })
    .then(() => {
      console.log("DB is connected");
    });
};

module.exports = connectDB;