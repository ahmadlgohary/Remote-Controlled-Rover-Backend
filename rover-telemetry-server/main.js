require("dotenv").config();
const app = require('./config/app');
const { connectMongo } = require("./config/db");

const PORT = 3002;

connectMongo();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
