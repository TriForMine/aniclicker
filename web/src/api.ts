import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { decode, encode } from "utils";
import { useStore } from "./store";

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
      return decode(new Uint8Array(data));
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
      useStore.setState({
        access_token: accessToken,
      });
      failedRequest.response.config.headers.authorization = `Bearer ${accessToken}`;
      return Promise.resolve();
    })
);

export default api;
