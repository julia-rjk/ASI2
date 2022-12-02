import { createServer } from "http";
import { createApplication } from "./controllers/app";
import * as dotenv from "dotenv";

dotenv.config();

const httpServer = createServer();
const PORT = process.env.PORT;
const CLIENTPORT = process.env.CLIENTPORT;
const URLCLIENT = process.env.URL + ":" + CLIENTPORT;
const URL = process.env.URL + ":" + PORT;

createApplication(
  httpServer,
  {
    cors: {
      origin: [URLCLIENT,`http://localhost:${CLIENTPORT}`],
    },
  }
);

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${URL}`);
});
