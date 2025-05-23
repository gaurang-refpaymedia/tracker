import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Keep if used elsewhere, not strictly needed for this component
import { AuthContext } from '../contextApi/AuthContext';

const ChangePasswordForm = () => {
  const { changePassword } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // New state for confirmation
  const [message, setMessage] = useState(null); // For user feedback messages
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'

  const handleSubmit = async (e) => { // Accept the event object
    e.preventDefault(); // Prevent default form submission behavior

    setMessage(null); // Clear previous messages
    setMessageType('');

    // --- Input Validation (Frontend) ---
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      setMessageType('danger');
      return; // Stop the submission
    }

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        setMessage("All fields are required.");
        setMessageType('danger');
        return;
    }

    // --- Call to AuthContext ---
    try {
      const response = await changePassword(oldPassword, newPassword);

      // Assuming changePassword from AuthContext returns { success: boolean, message: string }
      if (response.success) {
        setMessage(response.message || "Password changed successfully!");
        setMessageType('success');
        // Clear form fields on success
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setMessage(response.message || "An error occurred during password change.");
        setMessageType('danger');
      }
    } catch (error) {
      // This catches network errors or unhandled errors from changePassword function
      console.error("Error during password change:", error);
      setMessage("Failed to connect to the server or an unexpected error occurred.");
      setMessageType('danger');
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Change Password</h2>

      {message && (
        <span className={`d-block p-2 text-center rounded ${messageType === 'success' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'}`}>
          {message}
        </span>
      )}

      <form onSubmit={handleSubmit} className="w-100 mt-3 pt-2">
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name='newPassword1' // Good for accessibility/autofill, but not for state binding directly
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name='newPassword2' // Good for accessibility/autofill
            className="form-control"
            placeholder="Again New Password"
            value={confirmNewPassword} // Bind to new state variable
            onChange={(e) => setConfirmNewPassword(e.target.value)} // Update new state variable
            required
          />
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-lg btn-primary w-100">
            Change Password
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePasswordForm;