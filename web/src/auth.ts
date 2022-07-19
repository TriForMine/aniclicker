import api from "./api";

export async function login(email: string, password: string) {
  try {
    const res = await api.post(
      "/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const { accessToken, message } = res.data;
    return { accessToken, message, error: false };
  } catch (err) {
    if (err.response.data) {
      return { message: err.response.data.message, error: true };
    }
    return { message: "An error occurred", error: true };
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
      "/register",
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
  return api.get("/profile", {
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  });
}
