import { useState, useEffect } from "react";
import Styles from "./ChatSection.module.css";
import { sendMessage, getMessages } from "../../api/messages";
import ProfilePanel from "./CustomerDetails";

export default function ChatSection() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const sender = JSON.parse(localStorage.getItem("user"))?._id;
  const receiver = "685231cfd2a5898a7c43e017"; 
  
  const token =
    localStorage.getItem("token") ||
    new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!sender || !receiver || !token) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(sender, receiver, token);

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return;
        }

        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages", err);
        setMessages([]);
      }
    };

    fetchMessages();
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
        <ProfilePanel userId={receiver} />
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
