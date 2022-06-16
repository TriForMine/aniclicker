import { HttpResponse } from "uWebSockets.js";

export default (res: HttpResponse) => {
  res.writeHeader("Access-Control-Allow-Headers", "authorization");
  res.writeHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.writeHeader("Access-Control-Allow-Credentials", "true");
};
