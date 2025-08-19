import React, { useContext, useEffect, useState } from 'react';
import CardHeader from '../components/CardHeader';
import Pagination from '../components/Pagination';
import CardLoader from '../components/CardLoader';
import useCardTitleActions from '../customHooks/useCardTitleActions';
import { SubUserContext } from '../contextApi/subuserContext/SubUserContext';
import SubUserModal from './SubUserModal';

const SubUserListing = ({ title }) => {
  const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
  const { subUserListing, listingError, updateSubUserListing, fetchSubUserListing, updateSubUser, deleteSubUser } = useContext(SubUserContext);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('edit'); // edit | delete
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchSubUserListing();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const handleSave = async (updatedUser) => {
    await updateSubUser(selectedUser.id, updatedUser); // make sure your context has this API
    fetchSubUserListing();
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    await deleteSubUser(selectedUser.id); // delete by ID
    fetchSubUserListing();
    setShowModal(false);
  };

  return (
    <div className="col-lg-12">
      <div className={`card stretch stretch-full ${isExpanded ? 'card-expand' : ''} ${refreshKey ? 'card-loading' : ''}`}>
        <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

        <div className="card-body custom-card-action p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Clients</th>
                  <th>Role</th>
                  <th>User Code</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subUserListing.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="hstack gap-3">
                        <div className="avatar-image rounded">
                          <img className="img-fluid" src={'/images/avatar/12.png'} alt={'user'} />
                        </div>
                        <div>
                          <span className="d-block">{item.name}</span>
                          <span className="fs-12 text-muted">{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-capitalize">{item.role_code}</td>
                    <td>{item.company_code}</td>
                    <td>
                      <span className={`badge ${item.active_state ? 'bg-success' : 'bg-danger'}`}>{item.active_state ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td>
                      <div className="d-flex">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(item)}>
                        Delete
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer">
          <Pagination />
        </div>
        <CardLoader refreshKey={refreshKey} />
      </div>

      <SubUserModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} onDelete={handleConfirmDelete} type={modalType} userData={selectedUser} />

    </div>
  );
};

export default SubUserListing;
