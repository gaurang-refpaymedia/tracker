// src/components/ForgotPasswordModal.jsx
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components"; // Import styled-components
import { AuthContext } from "../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";

// --- Styled Components Definition ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's above other content */
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px; /* Max width for larger screens */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  position: relative; /* For positioning the close button */
  transform: translateY(0); /* Default position */
  transition: transform 0.3s ease-out; /* Smooth transition for opening */
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.3em;
    color: #333;
  }
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2em;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #555;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 20px;

  p {
    margin-bottom: 15px;
    line-height: 1.5;
    color: #555;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
    box-sizing: border-box; /* Crucial for full width with padding */

    &:focus {
      outline: none;
      border-color: #007bff; /* Example focus color */
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Example focus shadow */
    }
  }
`;

const MessageInfo = styled.p`
  color: #007bff; /* A nice info blue */
  margin-top: 15px;
  font-size: 0.95em;
`;

const SubmitButton = styled.button`
  background-color: #007bff; /* Primary button color */
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%; /* Full width button */
  font-size: 1.1em;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 20px;
`;

const SecondaryButton = styled.button`
  background-color: #6c757d; /* Secondary button color */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #5a6268; /* Darker gray on hover */
  }
`;

// --- React Component ---

const OTPGenerateModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { otpGenerate } = useContext(AuthContext);

  if (!show) {
    return null; // Don't render anything if the modal is not visible
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType(true); // Clear previous message type
    setLoading(true); // Set loading state

    try {
      await otpGenerate(email);
      setMessage(
        "OTP generated successfully. Redirecting to reset password page..."
      );

      setMessageType(true);
      setEmail("");

      setTimeout(() => {
        navigate("/forgot-password", { state: { email: email } });
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error in otpGenerateModal handleSubmit:", error);
      setMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      setMessageType(false);
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Prevent clicks inside from closing */}
        <ModalHeader>
          <h2>Reset Your Password</h2>
          <ModalCloseButton onClick={handleClose} disabled={loading}>&times;</ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <p>
            Enter your email address below and we'll send you a link to reset
            your password.
          </p>
          {message && <span className={`d-block p-2 ${messageType ? "bg-soft-success text-success" : "bg-soft-danger text-danger"} text-center rounded`}>{message}</span>}
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="resetEmail">Email Address</label>
              <input
                type="email"
                id="resetEmail"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading} // Disable input while loading
              />
            </FormGroup>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Sending OTP": "Send OTP for reset the password"}
            </SubmitButton>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default OTPGenerateModal;
