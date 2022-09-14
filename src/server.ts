import "dotenv/config";
import express, { Request, Response } from 'express';
import router from "./routes/router";
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';
import { connectDb } from "./database/connection";

const app = express();

const PORT = process.env.PORT;
const dbURI = process.env.DB_URI;

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

router.get('/', (req: Request, res: Response) => {
  res.send(listEndpoints(app))
})


/*app.get('/', (req, res) => {
  res.send('Hello World!');
});*/

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});

connectDb(dbURI);
