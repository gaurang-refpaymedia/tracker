import { useNavigate, useParams } from 'react-router-dom';
import { useAdvertisers } from '../../contextApi/advertiserContext/AdvertiserContext';
import { useEffect, useState } from 'react';

export default function AdvertiserForm() {
  const { id } = useParams();

  const isEdit = Boolean(id);
  const { addAdvertiser, editAdvertiser, loadAdvertiser, advertiser, error } = useAdvertisers();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    advcode: '',
    adv_country_id: '',
    adv_status_id: '',
    adv_state_id: '',
    adv_timezone_id: '',
    token: '',
    email: '',
  });

  useEffect(() => {
    if (isEdit) {
      loadAdvertiser(id);
    }
  }, [id]);

  useEffect(() => {
    if (advertiser && isEdit) {
      setFormData(advertiser);
    }
  }, [advertiser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    e.preventDefault();
    let result;
    if (isEdit) {
      result = editAdvertiser(id, formData);
    } else {
      result = addAdvertiser(formData);
    }

    if (result && !error) {
      navigate('/advertisers');
    }
  };

  return (
    <div className="row">
      <div className="col-12">{error && <p>{error.detail}</p>}</div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <h2 className="text-xl font-bold">{isEdit ? 'Edit Advertiser' : 'Create Advertiser'}</h2>

        <input name="advcode" value={formData.advcode} onChange={handleChange} placeholder="Advertiser Code" className="input input-bordered w-full" required />

        <input name="adv_country_id" value={formData.adv_country_id} onChange={handleChange} placeholder="Country ID" type="number" className="input input-bordered w-full" required />

        <input name="adv_status_id" value={formData.adv_status_id} onChange={handleChange} placeholder="Status ID" type="number" className="input input-bordered w-full" required />

        <input name="adv_state_id" value={formData.adv_state_id} onChange={handleChange} placeholder="State ID" type="number" className="input input-bordered w-full" required />

        <input name="adv_timezone_id" value={formData.adv_timezone_id} onChange={handleChange} placeholder="Timezone ID" type="number" className="input input-bordered w-full" required />

        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="input input-bordered w-full" required />

        <input name="token" value={formData.token} onChange={handleChange} placeholder="Token" className="input input-bordered w-full" />

        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAdvertisers } from "../../contextApi/advertiserContext/AdvertiserContext";

// export default function AdvertiserForm() {

//   useEffect(() => {
//     if (advertiser && isEdit) setFormData(advertiser);
//   }, [advertiser]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     let result;
//     if (isEdit) {
//       result = editAdvertiser(id, formData);
//     } else {
//       result = addAdvertiser(formData);
//     }

//     if(result && !error)
//     {
//       navigate("/advertisers");
//     }
//   };

//   return (

//     <div className="row">
//       <div className="col-12">
//         {error && <p>{error.detail}</p>}
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
//       <h2 className="text-xl font-bold">
//         {isEdit ? "Edit Advertiser" : "Create Advertiser"}
//       </h2>

//       <input
//         name="advcode"
//         value={formData.advcode}
//         onChange={handleChange}
//         placeholder="Advertiser Code"
//         className="input input-bordered w-full"
//         required
//       />

//       <input
//         name="adv_country_id"
//         value={formData.adv_country_id}
//         onChange={handleChange}
//         placeholder="Country ID"
//         type="number"
//         className="input input-bordered w-full"
//         required
//       />

//       <input
//         name="adv_status_id"
//         value={formData.adv_status_id}
//         onChange={handleChange}
//         placeholder="Status ID"
//         type="number"
//         className="input input-bordered w-full"
//         required
//       />

//       <input
//         name="adv_state_id"
//         value={formData.adv_state_id}
//         onChange={handleChange}
//         placeholder="State ID"
//         type="number"
//         className="input input-bordered w-full"
//         required
//       />

//       <input
//         name="adv_timezone_id"
//         value={formData.adv_timezone_id}
//         onChange={handleChange}
//         placeholder="Timezone ID"
//         type="number"
//         className="input input-bordered w-full"
//         required
//       />

//       <input
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         placeholder="Email"
//         type="email"
//         className="input input-bordered w-full"
//         required
//       />

//       <input
//         name="token"
//         value={formData.token}
//         onChange={handleChange}
//         placeholder="Token"
//         className="input input-bordered w-full"
//       />

//       <button type="submit" className="btn btn-primary">
//         {isEdit ? "Update" : "Create"}
//       </button>
//     </form>
//     </div>

//   );
// }
