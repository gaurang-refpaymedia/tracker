import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const SubUserModal = ({ show, onClose, onSave, onDelete, userData, type }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_code: '',
    password: '',
    active_state: true,
  });

  // preload userData in edit mode
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        role_code: userData.role_code || '',
        password: userData.password || '',
        active_state: userData.active_state ?? true,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{backgroundColor:"#022142bf",transition:"all 0.2s linear", }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header px-3 py-2">
            <h5 className="modal-title">{type === 'edit' ? 'Edit Sub User' : 'Delete the Sub User'}</h5>
            <button className="btn btn-link text-dark" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body px-3">
            {type === 'edit' ? (
              <>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Enter name" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter email" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Role Code</label>
                  <input type="text" name="role_code" value={formData.role_code} onChange={handleChange} className="form-control" placeholder="Enter role code" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="text" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter Password" />
                </div>

                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="active_state" checked={formData.active_state} onChange={handleChange} />
                  <label className="form-check-label">Active</label>
                </div>
              </>
            ) : (
              <p>
                Are you sure you want to delete <b>{userData?.name}</b>?
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer px-3 py-2">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {type === 'edit' ? (
              <button className="btn btn-primary" onClick={() => onSave(formData)}>
                Save Changes
              </button>
            ) : (
              <button className="btn btn-danger" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubUserModal;
