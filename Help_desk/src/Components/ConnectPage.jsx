import { useEffect } from "react";
import Styles from "./ConnectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook";

export default function ConnectPage({ onConnect }) {
  const handleFacebookConnect = () => {
    const backendUrl = import.meta.env.VITE_API_URL;
    const facebookAuthUrl = `${backendUrl}/api/auth/facebook`;
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
