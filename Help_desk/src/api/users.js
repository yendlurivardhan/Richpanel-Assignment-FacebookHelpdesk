import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";

export const getFacebookUserByPsid = async (psid) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/facebook/${psid}`
  );
  if (!res.ok) throw new Error("Failed to fetch Facebook user");
  return await res.json();
};
