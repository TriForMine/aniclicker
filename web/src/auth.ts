import api from "./api";

export async function login(email: string, password: string) {
  try {
    const res = await api.post(
      "http://localhost:9001/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const { accessToken } = res.data;
    return accessToken;
  } catch (err) {
    return false;
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  try {
    const res = await api.post(
      "http://localhost:9001/register",
      {
        username,
        email,
        password,
        confirmPassword,
      },
      {
        withCredentials: true,
      }
    );

    const { accessToken, message } = res.data;
    return { accessToken, message };
  } catch (err) {
    return { message: "Une erreur est survenue" };
  }
}

export function profile(access_token) {
  return api.get("http://localhost:9001/profile", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });
}
