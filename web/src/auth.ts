import api from "./api";

export async function login(email: string, password: string) {
  try {
    const res = await api.post("http://localhost:9001/login", {
      email,
      password,
    });

    const { accessToken } = res.data;
    return accessToken;
  } catch (err) {
    return false;
  }
}

export async function profile(access_token) {
  try {
    return api.get("http://localhost:9001/profile", {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });
  } catch (err) {
    return false;
  }
}
