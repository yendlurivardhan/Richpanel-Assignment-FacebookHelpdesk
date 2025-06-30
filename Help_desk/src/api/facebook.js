import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL + "/api";

export const exchangeTokenAndSavePages = async (accessToken, token) => {
  const res = await axios.post(
    `${API_BASE}/facebook/exchange-token`,
    { accessToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return res.data.pages;
};

export const getConnectedPages = async (token) => {
  const res = await axios.get(`${API_BASE}/pages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data.pages;
};
