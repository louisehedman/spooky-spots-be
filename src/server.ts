import "dotenv/config";
import express, { Request, Response } from 'express';
import router from "./routes/router";
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';
import { connectDb } from "./database/connection";
import { seedGhostTypes, seedSpookySpots } from "./seeder/seeder";
import morgan from "morgan";

const app = express();

const PORT = process.env.PORT;
const dbURI = process.env.DB_URI;

app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.use(morgan('tiny'));

router.get('/', (req: Request, res: Response) => {
  res.send(listEndpoints(app))
})

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});

connectDb(dbURI);

if (process.argv.includes("seed")) {
  seedGhostTypes();
  seedSpookySpots();
}
