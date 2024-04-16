import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userResetPassword } from "../actions/authAction";

const ResetPasswordPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      console.log(id, token, newPassword);
      dispatch(
        userResetPassword({ id: id, token: token, new_password: newPassword })
      );
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h1>Reset password</h1>
        <form action="">
          <label htmlFor="newPassword">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPassword}
            required
          />
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            required
          />
          <p className="noti-info">{error}</p>
          <button type="button" onClick={handleResetPassword}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
        <p>
          Just remember your password? <a href="">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
