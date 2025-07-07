import { useState, useEffect } from "react";
import Styles from "./ChatSection.module.css";
import { sendMessage, getMessages } from "../../api/messages";
import axios from "axios";

export default function ChatSection() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverName, setReceiverName] = useState("Username");
  const [loading, setLoading] = useState(true);

  const sender = JSON.parse(localStorage.getItem("user"))?._id;
  const receiver =
    localStorage.getItem("receiverPSID") || "REAL_PSID_HERE"; // Replace with actual PSID or dynamic logic

  const token =
    localStorage.getItem("token") ||
    new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!sender || !receiver || !token) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(sender, receiver, token);
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    const fetchUserName = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/facebook/user-profile/${receiver}`
        );
        const { first_name, last_name } = res.data;
        setReceiverName(`${first_name} ${last_name}`);
      } catch (err) {
        console.error("Error fetching FB user name", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    fetchUserName();
  }, [sender, receiver, token]);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const res = await sendMessage(sender, receiver, content, token);
      setMessages((prev) => [...prev, res]);
      setContent("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className={Styles.ChatSection}>
      <div className={Styles.Header}>
        <h3>{loading ? "Loading..." : receiverName}</h3>
      </div>

      <div className={Styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === sender ? Styles.chatLeft : Styles.chatRight
            }
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div>
        <input
          className={Styles.chatInputs}
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
    </div>
  );
}
