import { useState, useEffect } from "react";

import ConnectPage from "./ConnectPage";
import DeletePage from "./DeletePage";
import LoginPage from "./LoginPage";
import Register from "./Register";

import AgentProfile from "./Messanger/AgentProfile";
import Sidebar from "./Messanger/Sidebar";
import ConversationList from "./Messanger/ConversationList";
import ChatSection from "./Messanger/ChatSection";
import ProfilePanel from "./Messanger/ProfilePanel"; 

export default function DisplayDesk() {
  const [page, setPage] = useState("register");
  const [connected, setConnected] = useState(
    localStorage.getItem("connected") === "true"
  );
  const [selectedUserPsid, setSelectedUserPsid] = useState(null); // ✅ Add state

  const handleUserSelect = (psid) => {
    setSelectedUserPsid(psid); // ✅ Set selected PSID
  };

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
          localStorage.setItem("connected", "true");
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
        <ConversationList onSelect={handleUserSelect} />
        <ChatSection psid={selectedUserPsid} />
        <ProfilePanel psid={selectedUserPsid} />
      </AgentProfile>
    );

  return null;
}
