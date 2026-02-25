import React, { useState } from "react";
import { Link } from "react-router";
import "../style/form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading, handleLogin } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    await handleLogin(username, password);

    navigate("/");
  }

  if (loading) {
    return <main>
      <h1>Loading....</h1>
    </main>
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
            placeholder="Enter Your Username"
          />
          <input
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your Password"
          />
          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
