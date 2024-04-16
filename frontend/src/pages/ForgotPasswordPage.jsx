import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userForgotPassword } from "../actions/authAction";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { loading, error } = useSelector((state) => state.auth);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(userForgotPassword({ email: email }));
  };

  return (
    <div className="auth">
      <div className="container">
        <h1>Forgot password</h1>
        <p style={{ padding: "0 40px" }}></p>
        <form action="">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={handleEmail} required />
          {/* <p className="noti-info">{error}</p> */}
          <button type="button" onClick={handleForgotPassword}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
