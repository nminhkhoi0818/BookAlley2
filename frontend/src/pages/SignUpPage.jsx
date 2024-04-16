import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../actions/authAction";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignUpPage = () => {
  const { loading, success, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password }));
  };

  useEffect(() => {
    if (success) {
      toast.success("User signed in successfully", {
        position: "bottom-right",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    if (error !== null && error !== "Forbidden") {
      toast.error(error, {
        position: "bottom-right",
      });
    }
  }, [success, error, navigate]);

  return (
    <div className="auth">
      <div className="container">
        <h1>Register</h1>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsername}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            required
          />
          <button type="submit">{loading ? "Loading..." : "Register"}</button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/signin" style={{ textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
