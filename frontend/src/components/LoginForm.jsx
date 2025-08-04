import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contextApi/AuthContext";
import OTPGenerateModal from "./OTPGenerateModal";

const LoginForm = ({ registerPath, resetPath }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError,setLoginError] = useState('');
  const [showOTPGenerateModal, setShowOTPGenerateModal] = useState(false);

  const handleShowOTPGenerateModal = (e) => {
    e.preventDefault(); // Prevent default link behavior (e.g., scrolling to top)
    setShowOTPGenerateModal(true);
  };
  const handleCloseOTPGenerateModal = () => setShowOTPGenerateModal(false);



  const {isLoggedIn, login} = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email,password);
    
    if(result.success){
        // console.log("Login successful!", result.user);
        navigate('/dashboard');
    }
    else{
        console.log(result);
        // console.error("Login failed:", result.error);
        setLoginError(result.error);
    }
  }

  useEffect(() =>{
    if (isLoggedIn) {
        navigate('/dashboard');
    }
  },[isLoggedIn,navigate])

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Login</h2>
      <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
      {
        loginError && <span className="d-block p-2 bg-soft-danger text-danger text-center rounded">{loginError}</span>
      }
      <form onSubmit={handleSubmit} className="w-100 mt-3 pt-2">
        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <Link
              to="#" // Using '#' as a placeholder for current location
              onClick={handleShowOTPGenerateModal}
              className="fs-11 text-primary" // Use your Dualalux text styles
            >
              Forget password?
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100">
            Login
          </button>
        </div>
      </form>
      <div className="mt-5 text-muted">
        <span> Don't have an account? </span>
        <Link to={registerPath} className="fw-bold">
           Create an Account
        </Link>
      </div>
       <OTPGenerateModal
        show={showOTPGenerateModal}
        handleClose={handleCloseOTPGenerateModal}
      />
    </>
  );
};

export default LoginForm;
