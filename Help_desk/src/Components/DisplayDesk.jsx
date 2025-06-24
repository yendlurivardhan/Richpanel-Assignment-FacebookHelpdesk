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
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("connect");
    }
    
  }, []);

  if (page === "register") return <Register setPage={setPage} />;
  if (page === "login") return <LoginPage setPage={setPage} />;
  if (page === "connect" && !connected)
    return <ConnectPage onConnect={() => setConnected(true)} />;
  if (page === "delete") return <DeletePage />;

  return (
    <AgentProfile>
      <Sidebar />
      <ConversationList />
      <ChatSection />
      <CustomerDetails />
    </AgentProfile>
  );
}
