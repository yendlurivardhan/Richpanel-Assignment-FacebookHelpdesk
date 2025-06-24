// api/messages.js
import axios from "axios";

export const sendMessage = async (sender, receiver, content, token) => {
  const res = await axios.post(
    "http://localhost:4714/api/messages",
    { sender, receiver, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getMessages = async (sender, receiver, token) => {
  const res = await axios.get(
    `http://localhost:4714/api/messages?sender=${sender}&receiver=${receiver}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
