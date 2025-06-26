import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";

export const getUserById = async (id, token) => {
  const res = await axios.get(`${API_BASE}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};
