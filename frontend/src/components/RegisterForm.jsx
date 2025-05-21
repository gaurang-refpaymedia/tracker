import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contextApi/AuthContext';

const RegisterForm = ({ path }) => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        company_name: '',
        company_code: '',
        subscription_code: '',
        super_user_name: '',
        email: '',
    });

    const [subscriptions, setSubscriptions] = useState([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
    const [subscriptionError, setSubscriptionError] = useState('');

    const [companyCodeExists, setCompanyCodeExists] = useState(false);
    const [companyCodeChecked, setCompanyCodeChecked] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState({ type: '', text: '' });
    const [generatedPassword, setGeneratedPassword] = useState('');

    // --- Fetch Subscriptions on Component Mount ---
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/subscriptions");
                setSubscriptions(response.data);
                if (response.data.length > 0) {
                    // Optionally pre-select the first subscription if desired
                    setFormData(prev => ({ ...prev, subscription_code: response.data[0].code }));
                }
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
                setSubscriptionError("Failed to load subscription options.");
            } finally {
                setLoadingSubscriptions(false);
            }
        };
        fetchSubscriptions();
    }, []); // Empty dependency array means this runs once on mount

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'company_code') {
            setCompanyCodeChecked(false);
            setCompanyCodeExists(false);
        }
    };

    const handleCompanyCodeBlur = async () => {
        if (formData.company_code.trim() === '') {
            setCompanyCodeChecked(false);
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/check-company-code/${formData.company_code}`);
            setCompanyCodeExists(response.data.exists);
            setCompanyCodeChecked(true);
        } catch (error) {
            console.error("Error checking company code:", error);
            setCompanyCodeExists(false);
            setCompanyCodeChecked(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (companyCodeExists) {
            setRegistrationMessage({ type: 'error', text: 'Company code already exists. Please choose a different one.' });
            return;
        }
        if (!companyCodeChecked && formData.company_code.trim() !== '') {
            await handleCompanyCodeBlur();
            if (companyCodeExists) {
                setRegistrationMessage({ type: 'error', text: 'Company code already exists. Please choose a different one.' });
                return;
            }
        }
        if (!formData.subscription_code) {
             setRegistrationMessage({ type: 'error', text: 'Please select a subscription plan.' });
             return;
        }
        
        setRegistrationMessage({ type: '', text: '' });
        setGeneratedPassword('');

        const result = await register(
            formData.company_name,
            formData.company_code,
            formData.subscription_code, // This now comes from the radio button
            formData.super_user_name,
            formData.email
        );

        if (result.success) {
            setRegistrationMessage({ type: 'success', text: result.data.message });
            setGeneratedPassword(result.data.generated_password);
        } else {
            setRegistrationMessage({ type: 'error', text: result.error || 'Registration failed.' });
        }
    };

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Register</h2>
            <h4 className="fs-13 fw-bold mb-2">Manage all your Duralux crm</h4>
            <p className="fs-12 fw-medium text-muted">Let's get you all setup, so you can verify your personal
                account and begin setting up your profile.</p>
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Company Name"
                        name='company_name'
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        className={`form-control ${companyCodeChecked && (companyCodeExists ? 'is-invalid' : 'is-valid')}`}
                        placeholder="Company Code"
                        name='company_code'
                        value={formData.company_code}
                        onChange={handleChange}
                        onBlur={handleCompanyCodeBlur}
                        required
                    />
                    {companyCodeChecked && (
                        companyCodeExists ? (
                            <div className="invalid-feedback">Company code already exists.</div>
                        ) : (
                            <div className="valid-feedback">Company code is available.</div>
                        )
                    )}
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
                        <div className='d-flex gap-4'>
                            {subscriptions.map(sub => (
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
                                    <label className="form-check-label" htmlFor={`subscription-${sub.code}`}>
                                        {sub.code}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* --- End Subscription Radio Buttons --- */}

                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Super User Name"
                        name='super_user_name'
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
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {registrationMessage.text && (
                    <div className={`alert ${registrationMessage.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
                        {registrationMessage.text}
                    </div>
                )}
                {generatedPassword && (
                    <div className="alert alert-info mt-3">
                        Your temporary password: <strong>{generatedPassword}</strong>. Please save it.
                    </div>
                )}
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100" disabled={companyCodeChecked && companyCodeExists}>
                        Create Account
                    </button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>Already have an account?</span>
                <Link to={path} className="fw-bold"> Login</Link>
            </div>
        </>
    );
}

export default RegisterForm;