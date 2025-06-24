import { FaInbox, FaCommentDots, FaUsers, FaChartBar } from "react-icons/fa";
import Styles from "./SideBar.module.css";

export default function SideBar() {
  return (
    <div className={Styles.sidebar}>
      <div className={Styles.iconContainer}>
        <FaInbox className={Styles.icon} title="Inbox" />
        <FaCommentDots className={Styles.icon} title="Messages" />
        <FaUsers className={Styles.icon} title="Users" />
        <FaChartBar className={Styles.icon} title="Reports" />
      </div>
      <div className={Styles.profilePicContainer}>
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className={Styles.profilePic}
        />
      </div>
    </div>
  );
}
