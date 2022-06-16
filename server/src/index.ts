import { GameLoop } from "./game.js";
import { logger } from "./utils/logger.js";
import { WebApiApp } from "./server.js";
import { PORT } from "./config.js";

GameLoop();

WebApiApp.listen(PORT, (token) => {
  if (token) {
    logger.info("Listening to port " + PORT);
  } else {
    logger.fatal("Failed to listen to port " + PORT);
  }
});
