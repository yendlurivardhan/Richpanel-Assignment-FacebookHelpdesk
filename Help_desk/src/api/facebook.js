import axios from "axios";

const API_BASE = "http://localhost:4714/api";

export const exchangeTokenAndSavePages = async (accessToken, token) => {
  const res = await axios.post(
    `${API_BASE}/facebook/exchange-token`,
    { accessToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.pages;
};

export const getConnectedPages = async (token) => {
  const res = await axios.get("http://localhost:4714/api/pages", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.pages;
};
