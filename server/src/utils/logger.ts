import { pino } from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  translateTime: "yyyy-mm-dd HH:MM:ss.l",
  ignore: "pid,hostname",
});

export const logger = pino(
  {
    name: "aniclicker-server",
    level: "debug",
  },
  stream
);
