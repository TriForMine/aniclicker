import api from "./api";

export async function login(email: string, password: string) {
  try {
    const res = await api.post("http://localhost:9001/login", {
      email,
      password,
    }, {
        withCredentials: true,
    });

    const { accessToken } = res.data;
    return accessToken;
  } catch (err) {
    return false;
  }
}

export function profile(access_token) {
  return api.get("http://localhost:9001/profile", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });
}
