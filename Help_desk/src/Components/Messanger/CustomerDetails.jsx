import { useEffect, useState } from "react";
import Styles from "./CustomerDetails.module.css";
import { getUserById } from "../../api/users"; 

export default function ProfilePanel({ userId }) {
  const [user, setUser] = useState(null);

  const token =
    localStorage.getItem("token") ||
    new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId, token);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, [userId, token]);

  if (!user) return <div className={Styles.profilePanel}>Loading profile...</div>;

  return (
    <div className={Styles.profilePanel}>
      <div className={Styles.profileSection}>
        <img
          src={user.picture || "https://i.pravatar.cc/100"}
          alt="User"
          className={Styles.avatar}
        />
        <p className={Styles.name}>{user.name || "No name"}</p>
        <button className={Styles.Call}>📞 call</button>
        <button className={Styles.Profile}>👨 Profile</button>
      </div>

      <div className={Styles.section}>
        <h4>Customer Details</h4>
        <p>Email: {user.email || "Not available"}</p>
        <p>First Name: {user.firstName || "—"}</p>
        <p>Last Name: {user.lastName || "—"}</p>
        <button className={Styles.details}>View more details</button>
      </div>
    </div>
  );
}
