import { useState, useEffect } from "react";

import ConnectPage from "./ConnectPage";
import DeletePage from "./DeletePage";
import LoginPage from "./LoginPage";
import Register from "./Register";

import AgentProfile from "./Messanger/AgentProfile";
import Sidebar from "./Messanger/Sidebar";
import ConversationList from "./Messanger/ConversationList";
import ChatSection from "./Messanger/ChatSection";
import CustomerDetails from "./Messanger/CustomerDetails";

export default function DisplayDesk() {
  const [page, setPage] = useState("register");
  const [connected, setConnected] = useState(
    localStorage.getItem("connected") === "true"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setPage("register");
    } else if (token && !connected) {
      setPage("connect");
    } else if (token && connected) {
      setPage("messenger");
    }
  }, [connected]);

  if (page === "register") return <Register setPage={setPage} />;
  if (page === "login") return <LoginPage setPage={setPage} />;
  if (page === "connect" && !connected)
    return (
      <ConnectPage
        onConnect={() => {
          localStorage.setItem("connected", "true"); // ✅ Add this line
          setConnected(true);
          setPage("messenger");
        }}
      />
    );
  if (page === "delete") return <DeletePage />;
  if (page === "messenger")
    return (
      <AgentProfile>
        <Sidebar />
        <ConversationList />
        <ChatSection />
        <CustomerDetails />
      </AgentProfile>
    );

  return null;
}
