import { createServer } from "http";
import { createApplication } from "./controller/app";
import * as dotenv from "dotenv";

dotenv.config();

const httpServer = createServer();
const PORT= process.env.PORT;
const CLIENTPORT= process.env.CLIENTPORT;

createApplication(
  httpServer,
  {
    cors: {
      origin: [`http://localhost:${CLIENTPORT}`],
    },
  }
);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});