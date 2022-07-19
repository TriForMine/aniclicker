import { HttpResponse } from "uWebSockets.js";

export default (res: HttpResponse) => {
  res.writeHeader("Access-Control-Allow-Headers", "authorization");
  res.writeHeader(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production"
      ? "https://www.aniclicker.com"
      : "http://localhost:3000"
  );
  res.writeHeader("Access-Control-Allow-Credentials", "true");
};
