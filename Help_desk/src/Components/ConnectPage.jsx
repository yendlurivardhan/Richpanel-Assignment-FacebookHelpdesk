import { useEffect } from "react";
import Styles from "./connectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook"; // Your API helper

export default function ConnectPage({ onConnect }) {
  const handleFacebookConnect = () => {
  const fbAppId = import.meta.env.VITE_FB_APP_ID; // Your FB App ID from .env
  const redirectUri = "http://localhost:4714/api/auth/facebook/callback"; // Your backend FB callback

  // These are the scopes required for Messenger integration
  const scope = [
    "pages_messaging",
    "pages_show_list",
    "pages_read_engagement",
    "email",
    "public_profile"
  ].join(",");

  // Facebook OAuth URL
  const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scope}`;

  // Redirect user to Facebook login
  window.location.href = facebookAuthUrl;
};

  useEffect(() => {
    // ⏪ When redirected back from backend with a token
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");

    if (jwtToken) {
      // Save the token in localStorage for authenticated requests
      localStorage.setItem("token", jwtToken);

      // Optional: fetch and store connected pages
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
