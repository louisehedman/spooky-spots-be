import "dotenv/config";
import express, { Request, Response } from 'express';
import router from "./routes/router";
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import listEndpoints from 'express-list-endpoints';
import { connectDb } from "./database/connection";
import { seedGhostTypes, seedSpookySpots, seedCommunitySubjects } from "./seeder/seeder";

const app = express();

const PORT = process.env.PORT;
const dbURI = process.env.DB_URI;

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use("/", router);

router.get('/', (req: Request, res: Response) => {
  let text = '';
  // Link to API documentation
  text += '<a style="font-family:arial;font-size:2em" href=\"https://spookyspots-api.netlify.app/\">Go to API documentation</a>';
  text += '<div style="font-family:courier;">';
  text += '<p style="font-family:arial; font-size:2em">Available routes:</p>';
  // List all available endpoints
  listEndpoints(app).forEach(endpoint => {text += `<p>${JSON.stringify(endpoint)}</p>`});
  text += '</div>'
  res.send(text);
})

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});

connectDb(dbURI);

if (process.argv.includes("seed")) {
  seedGhostTypes();
  seedSpookySpots();
  seedCommunitySubjects();
}
