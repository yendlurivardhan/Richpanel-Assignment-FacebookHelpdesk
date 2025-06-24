import { useEffect } from "react";
import Styles from "./connectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook"; // 🔹 Add this

export default function ConnectPage({ onConnect }) {
  // 👉 Redirect user to Facebook login screen (your backend handles the callback)
  const handleFacebookConnect = () => {
    const fbAppId = import.meta.env.VITE_FB_APP_ID;
    const redirectUri = "http://localhost:4714/api/auth/facebook/callback"; // 🔁 Callback handled by backend
    const scope =
      "pages_messaging,pages_show_list,pages_read_engagement,email,public_profile";

    const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = facebookAuthUrl;
  };

  // ✅ Handle token exchange after Facebook redirects back with JWT + access_token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token"); // issued by backend

    if (jwtToken) {
      localStorage.setItem("token", jwtToken);

      // 🔹 Call Facebook Graph API to get short-lived access_token from URL hash if exists
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const fbAccessToken = hashParams.get("access_token");

      if (fbAccessToken) {
        // 🔁 Send to backend to fetch & save FB pages
        exchangeTokenAndSavePages(fbAccessToken, jwtToken)
          .then((pages) => {
            console.log("Saved Pages:", pages);
            if (onConnect) onConnect();
          })
          .catch((err) => {
            console.error("Error saving pages:", err);
          });
      } else {
        console.warn("No access_token found in URL");
      }
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
