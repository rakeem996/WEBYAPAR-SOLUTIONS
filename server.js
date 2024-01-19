const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConfig');

//handling uncaught exception erro
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server due to uncaught exception error");
  process.exit(1);
})

dotenv.config({path:'.env'})

connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is up and running on http://localhost:${process.env.PORT}`);
})

//unhandled promise rejection-----

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise`);
  server.close(() => {
      process.exit(1);
  })
})