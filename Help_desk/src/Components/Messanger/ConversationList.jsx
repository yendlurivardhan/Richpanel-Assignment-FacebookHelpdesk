import Styles from "./ConversationList.module.css";
import { MdRefresh } from "react-icons/md";
import { FaBars } from "react-icons/fa";

export default function ConversationList() {
  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <FaBars size={20} />
        <h2>Conversations</h2>
        <button className={Styles.refreshBtn}>
          <MdRefresh size={24} />
        </button>
      </div>
      <div className={Styles.chatList}>
        <div className={Styles.chatItem}>
          <p className={Styles.name}></p>
          <span className={Styles.time}></span>
          <p className={Styles.preview}></p>
        </div>
      </div>
    </div>
  );
}
