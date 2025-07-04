import { useEffect } from "react";
import Styles from "./ConnectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook";

export default function ConnectPage({ onConnect }) {
  const handleFacebookConnect = () => {
    const backendUrl = import.meta.env.VITE_FB_CALLBACK_URL;
    const facebookAuthUrl = `${backendUrl}/api/auth/facebook`;
    window.location.href = facebookAuthUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let jwtToken = urlParams.get("token");
    let accessToken = urlParams.get("access_token");

    // ✅ Handle if access token is in hash (after #)
    if (!accessToken && window.location.hash.includes("access_token")) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      accessToken = hashParams.get("access_token");
    }

    console.log("📘 Access Token:", accessToken);

    if (jwtToken && accessToken) {
      localStorage.setItem("token", jwtToken);

      exchangeTokenAndSavePages(accessToken, jwtToken)
        .then((pages) => {
          console.log("✅ Pages saved:", pages);
          localStorage.setItem("connected", "true");
          if (onConnect) {
            console.log("✅ onConnect called");
            onConnect();
          }
        })
        .catch((err) => {
          console.error(
            "❌ Error saving pages:",
            err.response?.data || err.message
          );
        });
    } else {
      console.warn("⚠️ Missing token or access token in URL");
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
