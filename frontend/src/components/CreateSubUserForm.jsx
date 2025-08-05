import React, { useEffect, useState, useContext } from 'react';
import { FiCalendar, FiCamera } from 'react-icons/fi'; // Using these icons from the original code
import getIcon from '../utils/getIcon'; // Assuming this is a utility to get icons
import Input from './InputComponents/Input'; // Assuming these are valid components
import SelectDropdown from './InputComponents/SelectDropdown'; // Assuming this is a valid component
import useLocationData from '../customHooks/useLocationData'; // Assuming this is a valid hook
import { FormDataContext } from '../contextApi/FormDataContext';
import { AuthContext } from '../contextApi/AuthContext';
import { formToJSON } from 'axios';

const CreateSubUserForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_code: '',
    password:'',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // useLocationData is assumed to be a custom hook that provides a memoized fetchCountries function
  const { countries, fetchCountries } = useLocationData();
  const { createSubUser, subUser } = useContext(FormDataContext);
  const { user } = useContext(AuthContext); // user is used for debugging and context but not passed to backend call

  useEffect(() => {
    // Adding fetchCountries to the dependency array to prevent the infinite re-render loop.
    // If fetchCountries changes on a re-render, the useEffect will be triggered.
    // To prevent this, ensure fetchCountries is memoized with useCallback in useLocationData.
    fetchCountries();
  }, [fetchCountries]); // Dependency array now includes fetchCountries

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleSelect = (option) => {
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      role_code: option.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // The backend gets the user's role and code from the authenticated session,
      // so we don't need to pass it from the client.
      await createSubUser(formData.name, formData.email, formData.role_code, formData.password);
      setFormData({
        name: '',
        email: '',
        role_code: '',
        password:'',
      });
      setSelectedOption(null);
      setMessage('Sub-user created successfully!');
      setIsError(false);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to create sub-user. Please try again.';
      console.error('Failed to create sub-user:', errorMessage);
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Super Admin', value: 'SUPER_ADMIN' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Sub-Admin', value: 'SUB_ADMIN' },
    { label: 'Publisher Manager', value: 'PUB_MANAGER' },
    { label: 'Publisher Executive', value: 'PUB_EXEC' },
    { label: 'Advertiser Manager', value: 'ADV_MANAGER' },
    { label: 'Advertiser Executive', value: 'ADV_EXEC' },
    { label: 'Financial Manager', value: 'FIN_MANAGER' },
    { label: 'Financial Executive', value: 'FIN_EXEC' },
    { label: 'Viewer', value: 'VIEWER' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-body personal-info">
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <h5 className="fw-bold mb-0 me-4">
              <span className="d-block mb-2">Add Sub Users:</span>
            </h5>
          </div>
          {/* Message box for user feedback */}
          {message && (
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
              {message}
            </div>
          )}
          {subUser ? <div className="alert alert-info">Generated Password: {subUser.generatedPassword}</div> : 'not generated'}
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
              <label htmlFor="name" className="fw-semibold">
                Name:
              </label>
            </div>
            <div className="col-lg-8">
              <div className="input-group">
                <div className="input-group-text">{getIcon('feather-user')}</div>
                <input type="text" name="name" className="form-control" id="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
              <label htmlFor="email" className="fw-semibold">
                Email:
              </label>
            </div>
            <div className="col-lg-8">
              <div className="input-group">
                <div className="input-group-text">{getIcon('feather-mail')}</div>
                <input type="email" name="email" className="form-control" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
              <label htmlFor="password" className="fw-semibold">
                Password:
              </label>
            </div>
            <div className="col-lg-8">
              <div className="input-group">
                <div className="input-group-text">{getIcon('feather-lock')}</div>
                <input type="password" name="password" className="form-control" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
              <label className="fw-semibold">Role: </label>
            </div>
            <div className="col-lg-8">
              <SelectDropdown options={roleOptions} selectedOption={selectedOption} defaultSelect={'Select Role'} onSelectOption={handleRoleSelect} />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Sub User'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateSubUserForm;
