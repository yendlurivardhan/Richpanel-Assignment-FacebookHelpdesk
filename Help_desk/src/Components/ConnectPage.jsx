import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./ConnectPage.module.css";
import { exchangeTokenAndSavePages } from "../api/facebook";

export default function ConnectPage({ onConnect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFacebookConnect = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const facebookAuthUrl = `${backendUrl}/api/auth/facebook`;
    console.log("📢 Will redirect to:", facebookAuthUrl); 
    window.location.href = facebookAuthUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let jwtToken = urlParams.get("token");
    let accessToken = urlParams.get("access_token");

    if (!accessToken && window.location.hash.includes("access_token")) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      accessToken = hashParams.get("access_token");
    }

    if (jwtToken && accessToken) {
      console.log("📘 Access Token:", accessToken);
      console.log("📘 JWT Token:", jwtToken);

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("fbAccessToken", accessToken);
      localStorage.setItem("connected", "true");

      setLoading(true);
      exchangeTokenAndSavePages(accessToken, jwtToken)
        .then((pages) => {
          console.log("✅ Pages saved:", pages);
          setLoading(false);
          if (onConnect) {
            console.log("✅ onConnect called");
            onConnect();
          }
          navigate("/"); // or navigate("/dashboard") if you have a dashboard
        })
        .catch((err) => {
          setLoading(false);
          setError(
            err.response?.data?.error || err.message || "Something went wrong"
          );
          console.error("❌ Error saving pages:", err);
        });
    } else {
      console.warn("⚠️ Missing token or access token in URL");
    }
  }, []);

  return (
    <div className={Styles.userFb}>
      <p className={Styles.FbPage}>Facebook Page Integration</p>

      {loading && <p className={Styles.statusMsg}>Connecting to Facebook...</p>}
      {error && <p className={Styles.errorMsg}>❌ {error}</p>}

      <button onClick={handleFacebookConnect} className={Styles.Fbconnect}>
        Connect Facebook Page
      </button>
    </div>
  );
}
