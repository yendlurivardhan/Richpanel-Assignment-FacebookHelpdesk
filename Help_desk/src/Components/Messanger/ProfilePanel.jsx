import { useEffect, useState } from "react";
import Styles from "./CustomerDetails.module.css";
import { getFacebookUserByPsid } from "../../api/users";

export default function ProfilePanel({ psid }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (psid) {
          const data = await getFacebookUserByPsid(psid);
          setUser({
            name: `${data.first_name} ${data.last_name}`,
            picture: data.profile_pic,
            email: "Facebook User",
            firstName: data.first_name,
            lastName: data.last_name,
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    if (psid) fetchUser();
  }, [psid]);

  if (!user)
    return <div className={Styles.profilePanel}>Loading profile...</div>;

  return (
    <div className={Styles.profilePanel}>
      <div className={Styles.profileSection}>
        <img
          src={user.picture || "https://i.pravatar.cc/100"}
          alt="User"
          className={Styles.avatar}
        />
        <p className={Styles.name}>{user.name}</p>
        <button className={Styles.Call}>📞 Call</button>
        <button className={Styles.Profile}>👨 Profile</button>
      </div>

      <div className={Styles.section}>
        <h4>Customer Details</h4>
        <p>Email: {user.email}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <button className={Styles.details}>View more details</button>
      </div>
    </div>
  );
}
