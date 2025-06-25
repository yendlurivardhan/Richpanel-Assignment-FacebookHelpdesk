import { useState } from "react";
import Styles from "./LoginPage.module.css";
import { loginUser } from "../api/auth";

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginUser(email, password);
    if (res.token || res.message === "User successfully login") {
      alert("User login successful");
      localStorage.setItem("token", res.token);
      setPage("connect"); // Go to ConnectPage after login
    } else {
      alert(res.message || "Login failed");
    }
  };

  return (
    <div className={Styles.userLoginpage}>
      <p className={Styles.Title}>Login to your account</p>

      <p>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={Styles.userEmail}
          type="email"
          placeholder="UserName123@gmail.com"
        />
      </p>

      <p>
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={Styles.userPassword}
          type="password"
          placeholder="Password"
        />
      </p>

      <label>
        <input className={Styles.check} type="checkbox" />
        Remember Me
      </label>

      <button onClick={handleLogin} className={Styles.userLogin}>
        Login
      </button>

      <div className={Styles.newuser}>
        <p>
          New to MyApp?
          <button
            className={Styles.SignUpBorder}
            onClick={() => setPage("register")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
