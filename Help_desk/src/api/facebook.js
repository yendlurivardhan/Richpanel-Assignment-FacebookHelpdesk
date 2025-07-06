import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";

export const exchangeTokenAndSavePages = async (accessToken, jwtToken) => {
  const res = await axios.post(
    `${API_BASE}/facebook/exchange-token`,
    { accessToken },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
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

export const getFacebookUserProfile = async (psid) => {
  const res = await axios.get(`${API_BASE}/facebook/user-profile/${psid}`);
  return res.data;
};
