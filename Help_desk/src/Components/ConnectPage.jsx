import { useEffect } from "react";
import Styles from "./connectPage.module.css"; // ✅ Must match exact filename
import { exchangeTokenAndSavePages } from "../api/facebook"; // Helper to exchange token and save pages

export default function ConnectPage({ onConnect }) {
  const handleFacebookConnect = () => {
    const fbAppId = import.meta.env.VITE_FB_APP_ID;

    // ✅ Use your deployed backend URL
    const redirectUri = "https://facebook-helpdesk-8.onrender.com/api/auth/facebook/callback";

    const scope = [
      "pages_messaging",
      "pages_show_list",
      "pages_read_engagement",
      "email",
      "public_profile",
    ].join(",");

    const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;

    // 🔁 Redirect user to Facebook Login
    window.location.href = facebookAuthUrl;
  };

  useEffect(() => {
    // 🔄 After Facebook redirects back with a token
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");

    if (jwtToken) {
      localStorage.setItem("token", jwtToken);

      // 🔁 Optionally fetch pages immediately
      exchangeTokenAndSavePages(null, jwtToken)
        .then((pages) => {
          console.log("Saved Pages:", pages);
          if (onConnect) onConnect();
        })
        .catch((err) => {
          console.error("Error saving pages:", err);
        });
    }
  }, []);

  return (
    <div className={Styles.userFb}>
      <p className={Styles.FbPage}>Facebook Page Integration</p>
      <button onClick={handleFacebookConnect} className={Styles.Fbconnect}>
        Connect Facebook Page
      </button>
    </div>
  );
}
