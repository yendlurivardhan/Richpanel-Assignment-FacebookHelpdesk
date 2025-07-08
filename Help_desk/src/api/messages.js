import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/facebook";

// ✅ Send a message to a Facebook user by PSID
export const sendMessage = async (recipientId, messageText) => {
  try {
    const res = await axios.post(`${API_BASE}/send-message`, {
      recipientId,
      message: messageText,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error sending message:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Get messages from a conversation with a Facebook user by PSID
export const getMessages = async (psid) => {
  try {
    const res = await axios.get(`${API_BASE}/conversations/${psid}`);
    return res.data.messages;
  } catch (err) {
    console.error("❌ Error fetching messages:", err.response?.data || err.message);
    throw err;
  }
};

export const getUserProfile = async (psid) => {
  const res = await axios.get(`${API_BASE}/user-profile/${psid}`);
  return res.data; // { first_name, last_name, profile_pic }
};