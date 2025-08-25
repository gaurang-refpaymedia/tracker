import React from 'react';
import getIcon from '../../utils/getIcon';

const Input = ({ label, icon, type = 'text', placeholder, labelId, name, centerLink, onChange, value }) => {
  return (
    <div className="row mb-4 align-items-center">
      <div className="col-lg-12">
        <input value={value} type={type} name={name} onChange={onChange} className="form-control" id={labelId} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default Input;
