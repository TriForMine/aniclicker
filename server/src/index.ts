import { GameLoop } from "./game";
import { logger } from "./helpers/logger";
import { WebApiApp } from "./server";
import { PORT } from "./config";

GameLoop();

WebApiApp.listen(PORT, (token) => {
  if (token) {
    logger.info("Listening to port", PORT);
  } else {
    logger.fatal("Failed to listen to port", PORT);
  }
});
