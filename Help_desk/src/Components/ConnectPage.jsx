import { useEffect } from "react";
import Styles from "./ConnectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook";

export default function ConnectPage({ onConnect }) {
  const handleFacebookConnect = () => {
    const fbAppId = import.meta.env.VITE_FB_APP_ID;
    const redirectUri = import.meta.env.VITE_FB_CALLBACK_URL;

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

    window.location.href = facebookAuthUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");

    if (jwtToken) {
      localStorage.setItem("token", jwtToken);

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
