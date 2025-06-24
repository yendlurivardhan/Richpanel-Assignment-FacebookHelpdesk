import axios from "axios";

export const getUserById = async (id, token) => {
  const res = await axios.get(`http://localhost:4714/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
