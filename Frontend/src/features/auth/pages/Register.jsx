import React, { useState } from "react";
import { Link, Links } from "react-router";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:5000/api/auth/register",
        { username, email, password },
        { withCredentials: true },
      )
      .then((res) => console.log(res.data));
  }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={submitHandler}>
          <input
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
            placeholder="Enter Your Username"
          />
          <input
            onInput={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
          />
          <input
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your Password"
          />
          <button type="submit" className="btn">
            Register
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link className="toggleAuthForm" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
