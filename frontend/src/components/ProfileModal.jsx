import React, { Fragment, useContext } from 'react'
import { FiActivity, FiBell, FiChevronRight, FiDollarSign, FiLogOut, FiSettings, FiUser } from "react-icons/fi"
import { AuthContext } from '../contextApi/AuthContext'
import { Link } from 'react-router-dom';

const ProfileModal = ({user}) => {
    const {logout} = useContext(AuthContext);
    console.log("user info",user);
    return (
        <div className="dropdown nxl-h-item">
            <a href="#" data-bs-toggle="dropdown" role="button" data-bs-auto-close="outside">
                <img src="/images/avatar/1.png" alt="user-image" className="img-fluid user-avtar me-0" />
            </a>
            <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                        <img src="/images/avatar/1.png" alt="user-image" className="img-fluid user-avtar" />
                        <div>
                            <h6 className="text-dark mb-0">{user.name} <span className="badge bg-soft-success text-success ms-1">{user.user_code}</span></h6>
                            <span className="fs-12 fw-medium text-muted">{user.email}</span>
                        </div>
                    </div>
                </div>
                <Link to={'/change-password'} className="dropdown-item">
                    <i><FiSettings /></i>
                    <span>Change Password</span>
                </Link>
                {
                    user.role_code === 'SUPER_ADMIN' && <Link to={'/create-sub-user'} className="dropdown-item">
                    <i><FiSettings /></i>
                    <span>Create Sub User</span>
                </Link>
                }
                <div className="dropdown-divider"></div>
                <button onClick={logout} type='button' className="dropdown-item">
                    <i> <FiLogOut /></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default ProfileModal