import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL+ "/api";

export const sendMessage = async (sender, receiver, content, token) => {
  const res = await axios.post(
    `${API_BASE}/messages`,
    { sender, receiver, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const getMessages = async (sender, receiver, token) => {
  const res = await axios.get(
    `${API_BASE}/messages?sender=${sender}&receiver=${receiver}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};
