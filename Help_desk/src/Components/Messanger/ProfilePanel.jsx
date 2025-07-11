import { useEffect, useState } from "react";
import Styles from "./CustomerDetails.module.css";

export default function ProfilePanel({ psid }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFacebookUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/facebook/${psid}`
        );
        const data = await res.json();

        if (data?.first_name) {
          setUser({
            name: `${data.first_name} ${data.last_name}`,
            picture: data.profile_pic,
            email: "Facebook User",
          });
        } else {
          console.error("No valid Facebook user returned:", data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    if (psid) fetchFacebookUser();
  }, [psid]);

  if (!user)
    return (
      <div className={Styles.profilePanel}>
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className={Styles.profilePanel}>
      <div className={Styles.profileSection}>
        <img
          src={user.picture || "https://i.pravatar.cc/100"}
          alt="User"
          className={Styles.avatar}
        />
        <p className={Styles.name}>{user.name}</p>
        <button className={Styles.Call}>📞 call</button>
        <button className={Styles.Profile}>👤 Profile</button>
      </div>

      <div className={Styles.section}>
        <h4>Customer Details</h4>
        <p>Email: {user.email}</p>
        <p>First Name: {user.name.split(" ")[0]}</p>
        <p>Last Name: {user.name.split(" ")[1]}</p>
        <button className={Styles.details}>View more details</button>
      </div>
    </div>
  );
}
