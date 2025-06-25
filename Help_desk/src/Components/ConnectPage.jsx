import { useEffect } from "react";
import Styles from "./connectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook"; // Your API helper

export default function ConnectPage({ onConnect }) {
  // 👉 Trigger Facebook Login flow
  const handleFacebookConnect = () => {
    const fbAppId = import.meta.env.VITE_FB_APP_ID;
    
    // 🔁 Use deployed backend callback (Render)
    const redirectUri = "https://facebook-helpdesk-8.onrender.com/api/auth/facebook/callback";

    const scope = [
      "pages_messaging",
      "pages_show_list",
      "pages_read_engagement",
      "email",
      "public_profile"
    ].join(",");

    const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;

    // 🔄 Redirect to Facebook login
    window.location.href = facebookAuthUrl;
  };

  // ✅ Handle return from backend with JWT token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");

    if (jwtToken) {
      localStorage.setItem("token", jwtToken);

      // Fetch and save Facebook pages
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
