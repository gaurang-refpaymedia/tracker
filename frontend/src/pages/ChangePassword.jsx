import React from "react";
import { Link } from "react-router-dom";
import ChangePasswordForm from "../components/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <main className="auth-minimal-wrapper" style={{minHeight:"80vh"}}>
            <div className="auth-minimal-inner"  style={{minHeight:"80vh"}}>
                <div className="minimal-card-wrapper">
                    <div className="card mb-4 mx-4 mx-sm-0 position-relative">
                        <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
                            <img src="/images/logo-abbr.png" alt="img" className="img-fluid" />
                        </div>
                        <div className="card-body p-sm-5">
                            <ChangePasswordForm/>
                        </div>
                    </div>
                </div>
            </div>
    </main>
  );
};

export default ChangePassword;
