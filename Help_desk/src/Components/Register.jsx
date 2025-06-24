import { useState } from "react";
import Styles from "./Register.module.css";
import { registerUser } from "../api/auth";

export default function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={Styles.inputs}>
      <p className={Styles.Account}>Create Account</p>

      <p>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={Styles.User}
          type="text"
          placeholder="UserName"
        />
      </p>
      <p>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={Styles.Email}
          type="text"
          placeholder="UserName123@gmail.com"
        />
      </p>
      <p>
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={Styles.password}
          type="Password"
          placeholder="Password"
        />
      </p>
      <label>
        <input className={Styles.check} type="checkbox" />
        Remember Me
      </label>

      <button
        onClick={async () => {
          const res = await registerUser(name, email, password);
          if (res.token || res.message === "User Registration is successful") {
            alert("Registration is successfull");
            setPage("login");
          } else {
            alert(res.message || "Registration Failed");
          }
        }}
        className={Styles.signUp}
      >
        Sign Up
      </button>
      <div className={Styles.loginLink}>
        Already have an Account?
        <button className={Styles.Login} onClick={() => setPage("login")}>
          Login
        </button>
      </div>
    </div>
  );
}
