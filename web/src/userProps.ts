import { GetServerSideProps } from "next";
import api from "./api";
import { initializeStore } from "./store";

export const getUserProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const cookie = req.headers.cookie;
  console.log('FETCHING DATA', cookie)
  try {
    const data = await api.post("/refreshToken", null, {
      headers: {
        cookie,
      },
    }).then((res) => {
        console.log('DATA', res.data)
        return res;
    });

    res.setHeader("Set-Cookie", data.headers["set-cookie"]);

    const userData = await api.get("/profile", {
      headers: {
        authorization: `Bearer ${data.data.accessToken}`,
      },
    });

    const zustandStore = initializeStore();

    zustandStore.getState().setAccessToken(data.data.accessToken);
    zustandStore.getState().setUserInfo(userData.data);

    return {
      props: { initialZustandState: JSON.stringify(zustandStore.getState()) },
    };
  } catch (e) {
    console.log(e)
    return {
      props: {},
    };
  }
};
