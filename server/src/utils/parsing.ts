/* Helper function for reading a posted JSON body */
import { HttpResponse } from "uWebSockets.js";
import { decode } from "utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function readCbor(res: HttpResponse): Promise<any> {
  return new Promise((resolve, reject) => {
    let buffer: Buffer;
    /* Register data cb */
    res.onData((ab, isLast) => {
      const chunk = Buffer.from(ab);
      if (isLast) {
        let json;
        if (buffer) {
          try {
            json = decode(Buffer.concat([buffer, chunk]));
          } catch (e) {
            /* res.close calls onAborted */
            res.close();
            return;
          }
          resolve(json);
        } else {
          try {
            json = decode(chunk);
          } catch (e) {
            /* res.close calls onAborted */
            res.close();
            return;
          }
          resolve(json);
        }
      } else {
        if (buffer) {
          buffer = Buffer.concat([buffer, chunk]);
        } else {
          buffer = Buffer.concat([chunk]);
        }
      }
    });

    /* Register error cb */
    res.onAborted(reject);
  });
}
