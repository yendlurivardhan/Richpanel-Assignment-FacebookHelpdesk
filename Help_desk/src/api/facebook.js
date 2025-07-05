import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL+ "/api";

export const exchangeTokenAndSavePages = async (accessToken, jwtToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/facebook/exchange-token`,
    { accessToken }, // ✅ request body
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`, // ✅ JWT in headers
      },
    }
  );
  return res.data;
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
