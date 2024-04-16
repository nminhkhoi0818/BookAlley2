import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../actions/authAction";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignInPage = () => {
  const dispatch = useDispatch();
  const { access_token, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

  useEffect(() => {
    if (access_token !== null) {
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
  }, [error, access_token, navigate]);

  return (
    <div className="auth">
      <div className="container">
        <h1>Login</h1>
        <form action="" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleEmail}
            placeholder=""
            required
          />
          <label htmlFor="">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
            required
          />
          <Link to={"/forgot-password"} style={{ textDecoration: "underline" }}>
            Forgot password?
          </Link>
          <button type="submit">{loading ? "Loading..." : "Log In"}</button>
        </form>
        <p>
          Don't have an account? Register{" "}
          <Link to="/signup" style={{ textDecoration: "underline" }}>
            now
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignInPage;
