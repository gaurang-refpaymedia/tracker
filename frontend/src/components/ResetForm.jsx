import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contextApi/AuthContext";

const ResetForm = ({ path }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(true);
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setMessageType(""); // Clear previous message type
    setLoading(true); // Set loading state

    try {
      await forgotPassword(email, otp, newPassword, confirmPassword);
      setMessage("Password change successfully. Redirecting to login page...");
      setMessageType(true);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error in reset password handleSubmit:", error);
      setMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      setMessageType(false);
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Reset</h2>
      <h4 className="fs-13 fw-bold mb-2">Reset to your password</h4>
      <p className="fs-12 fw-medium text-muted">
        Enter your OTP and new password, let's access our the best
        recommendation for you.
      </p>
      {
        message && <span className={`d-block p-2 ${messageType ? "bg-soft-success text-success" : "bg-soft-danger text-danger"} text-center rounded`}>{message}</span>
      }
      <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="otp"
            className="form-control"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="newPassword"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100">
            {loading ? "Please Wait" : "Reset Now"}
          </button>
        </div>
      </form>
      <div className="mt-5 text-muted">
        <span> Don't have an account?</span>
        <Link to={path} className="fw-bold">
          Create an Account
        </Link>
      </div>
    </>
  );
};

export default ResetForm;
