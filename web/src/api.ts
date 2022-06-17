import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { decode, encode } from "utils";
import {initializeStore, store} from "./store";

const api = axios.create({
  baseURL: "http://localhost:9001",
  responseType: "arraybuffer",
  transformRequest: [
    function (data) {
      if (data) {
        return encode(data);
      }
    },
  ],
  transformResponse: [
    function (data) {
      if (data) {
        try {
          return decode(new Uint8Array(data));
        } catch (err) {
          return new TextDecoder().decode(data);
        }
      } else {
        return data;
      }
    },
  ],
});

createAuthRefreshInterceptor(api, (failedRequest) =>
  api
    .post("/refreshToken", null, {
      withCredentials: true,
    })
    .then((resp) => {
      const { accessToken } = resp.data;
      if (store) {
        store.getState().setAccessToken(accessToken)
      }

      failedRequest.response.config.headers.authorization = `Bearer ${accessToken}`;
      return Promise.resolve();
    })
);

export default api;
