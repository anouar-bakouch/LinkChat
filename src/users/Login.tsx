import { useState } from "react";
import { CustomError } from "../models/CustomError";
import { Session } from "../models/Session";
import { loginUser } from "./loginApi";
import React from "react";
import "./Login.css";

export function Login() {
  const [error, setError] = useState({} as CustomError);
  const [session, setSession] = useState({} as Session);

  const HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    loginUser(
      {
        user_id: -1,
        username: data.get("login") as string,
        password: data.get("password") as string,
      },
      (result: Session) => {
        setSession(result);
        form.reset();
        setError(new CustomError(""));
      },
      (loginError: CustomError) => {
        setError(loginError);
        setSession({} as Session);
      }
    );
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={HandleSubmit}>
        <input name="login" placeholder="login" /><br />
        <input name="password" type="password" placeholder="password" /><br />
        <button type="submit">connexion</button>
      </form>
      {session.token && (
        <span className="session-info">
          {session.username} : {session.token}
        </span>
      )}
      {error.message && <span className="error-message">{error.message}</span>}
    </div>
  );
}