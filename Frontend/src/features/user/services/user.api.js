import axios from "axios";

const api = axios.create({
  baseURL: "https://instagrow-h9rx.onrender.com/api/user",
  withCredentials: true,
});

export async function followUser(username) {
  const response = await api.post(`/follow/${username}`);
  return response.data;
}

export async function unfollowUser(username) {
  const response = await api.post(`/unfollow/${username}`);
  return response.data;
}

