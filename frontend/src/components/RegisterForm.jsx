import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Keep if you use it for anything else, otherwise can remove
import { AuthContext } from "../contextApi/AuthContext";
import { DataContext } from "../contextApi/DataContext";

const RegisterForm = ({ path }) => {
  const {
    checkCompanyCode,
    subscriptions, // This is now directly available from DataContext state
    loadingSubscriptions, // This is now directly available from DataContext state
    subscriptionError, // This is now directly available from DataContext state
    subscriptionsItems, // This is the function to fetch them
  } = useContext(DataContext);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    company_code: "",
    subscription_code: "", // This will be set by useEffect or the first subscription
    super_user_name: "",
    email: "",
  });

  // Set initial companyCodeExists to false, assuming a code doesn't exist until verified
  const [companyCodeExists, setCompanyCodeExists] = useState(false);
  const [companyCodeChecked, setCompanyCodeChecked] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState({
    type: "",
    text: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState("");

  // --- useEffect to fetch subscriptions and auto-select the first one ---
  useEffect(() => {
    subscriptionsItems(); // Trigger the fetch from DataContext

    // This effect runs whenever 'subscriptions' array changes.
    // This is the correct place to auto-select the first subscription
    if (subscriptions.length > 0 && !formData.subscription_code) {
      setFormData((prev) => ({
        ...prev,
        subscription_code: subscriptions[0].code,
      }));
    }
  }, [subscriptions, subscriptionsItems, formData.subscription_code]); // Add subscriptions and subscriptionsItems to dependency array
  // formData.subscription_code is added to prevent re-setting if user manually changes it.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "company_code") {
      setCompanyCodeChecked(false);
      setCompanyCodeExists(false); // Reset existence check when code changes
      setRegistrationMessage({ type: "", text: "" }); // Clear messages
    }
  };

  const handleCompanyCodeBlur = async () => {
    const currentCompanyCode = formData.company_code.trim();
    if (currentCompanyCode === "") {
      setCompanyCodeChecked(false);
      setCompanyCodeExists(false); // If empty, it definitely doesn't exist
      return;
    }
    try {
      // Call the context function and await its result
      let isExists = await checkCompanyCode(currentCompanyCode);
      console.log(
        "RegisterForm: handleCompanyCodeBlur received 'exists':",
        isExists
      );
      setCompanyCodeExists(isExists);
      setCompanyCodeChecked(true); // Mark as checked after the API call
    } catch (error) {
      console.error(
        "RegisterForm: Error checking company code (on blur):",
        error
      );
      setCompanyCodeExists(false); // Assume false on API error
      setCompanyCodeChecked(true); // Still mark as checked after the attempt
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCompanyCodeExists = companyCodeExists; // Use the current state value first

    // If company code hasn't been checked yet, or if it was empty and now has a value, check it on submit
    if (
      !companyCodeChecked ||
      (companyCodeChecked &&
        formData.company_code.trim() !== "" &&
        formData.company_code.trim() !== formData.company_code)
    ) {
      console.log(
        "handleSubmit: Company code not checked or changed, performing fresh check..."
      );
      finalCompanyCodeExists = await checkCompanyCode(formData.company_code); // Re-check to get the very latest
      setCompanyCodeExists(finalCompanyCodeExists); // Update state for UI
      setCompanyCodeChecked(true); // Mark as checked for UI
    }

    if (finalCompanyCodeExists) {
      setRegistrationMessage({
        type: "error",
        text: "Company code already exists. Please choose a different one.",
      });
      return;
    }

    // Check if a subscription plan is selected
    if (!formData.subscription_code) {
      setRegistrationMessage({
        type: "error",
        text: "Please select a subscription plan.",
      });
      return;
    }

    setRegistrationMessage({ type: "", text: "" }); // Clear messages before registration attempt
    setGeneratedPassword("");

    const result = await register(
      formData.company_name,
      formData.company_code,
      formData.subscription_code,
      formData.super_user_name,
      formData.email
    );

    if (result.success) {
      setRegistrationMessage({ type: "success", text: result.data.message });
      setGeneratedPassword(result.data.generated_password);
    } else {
      setRegistrationMessage({
        type: "error",
        text: result.error || "Registration failed.",
      });
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Register</h2>
      <h4 className="fs-13 fw-bold mb-2">Manage all your Duralux crm</h4>
      <p className="fs-12 fw-medium text-muted">
        Let's get you all setup, so you can verify your personal account and
        begin setting up your profile.
      </p>
      <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className={`form-control ${
              companyCodeChecked &&
              (companyCodeExists ? "is-invalid" : "is-valid")
            }`}
            placeholder="Company Code"
            name="company_code"
            value={formData.company_code}
            onChange={handleChange}
            onBlur={handleCompanyCodeBlur}
            required
          />
          {companyCodeChecked &&
            (companyCodeExists ? (
              <div className="invalid-feedback">
                Company code already exists.
              </div>
            ) : (
              <div className="valid-feedback">Company code is available.</div>
            ))}
        </div>

        {/* --- Subscription Radio Buttons --- */}
        <div className="mb-4">
          <label className="form-label">Select Subscription Plan:</label>
          {loadingSubscriptions ? (
            <div>Loading subscriptions...</div>
          ) : subscriptionError ? (
            <div className="text-danger">{subscriptionError}</div>
          ) : subscriptions.length === 0 ? (
            <div>No subscription plans available.</div>
          ) : (
            <div className="d-flex gap-4">
              {subscriptions.map((sub) => (
                <div className="form-check" key={sub.code}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="subscription_code"
                    id={`subscription-${sub.code}`}
                    value={sub.code}
                    checked={formData.subscription_code === sub.code}
                    onChange={handleChange}
                    required
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`subscription-${sub.code}`}
                  >
                    {sub.code}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Super User Name"
            name="super_user_name"
            value={formData.super_user_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {registrationMessage.text && (
          <div
            className={`alert ${
              registrationMessage.type === "success"
                ? "alert-success"
                : "alert-danger"
            } mt-3`}
          >
            {registrationMessage.text}
          </div>
        )}
        {generatedPassword && (
          <div className="alert alert-info mt-3">
            Your temporary password: <strong>{generatedPassword}</strong>.
            Please save it.
          </div>
        )}
        <div className="mt-5">
          <button
            type="submit"
            className="btn btn-lg btn-primary w-100"
            disabled={companyCodeChecked && companyCodeExists}
          >
            Create Account
          </button>
        </div>
      </form>
      <div className="mt-5 text-muted">
        <span>Already have an account?</span>
        <Link to={path} className="fw-bold">
          {" "}
          Login
        </Link>
      </div>
    </>
  );
};

export default RegisterForm;
