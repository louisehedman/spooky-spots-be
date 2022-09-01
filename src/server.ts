import "dotenv/config";
import express from 'express';
import { connectDb } from "./database/connection";

const app = express();

const PORT = process.env.PORT;
const dbURI = process.env.DB_URI;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});

connectDb(dbURI);
