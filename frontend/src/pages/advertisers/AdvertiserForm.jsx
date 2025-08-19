import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdvertisers } from "../../contextApi/advertiserContext/AdvertiserContext";


export default function AdvertiserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { addAdvertiser, editAdvertiser, loadAdvertiser, advertiser } = useAdvertisers();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    contact_person: "",
    contact_number: "",
    address: "",
    currency: "",
    active_state: true,
  });

  useEffect(() => {
    if (isEdit) loadAdvertiser(id);
  }, [id]);

  useEffect(() => {
    if (advertiser && isEdit) setFormData(advertiser);
  }, [advertiser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      editAdvertiser(id, formData);
    } else {
      addAdvertiser(formData);
    }
    navigate("/advertisers");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-bold">{isEdit ? "Edit Advertiser" : "Create Advertiser"}</h2>
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full" />
      <input name="contact_person" value={formData.contact_person} onChange={handleChange} placeholder="Contact Person" className="input input-bordered w-full" />
      <input name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" className="input input-bordered w-full" />
      <input name="currency" value={formData.currency} onChange={handleChange} placeholder="Currency" className="input input-bordered w-full" />
      <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="textarea textarea-bordered w-full" />
      <label>
        <input type="checkbox" name="active_state" checked={formData.active_state} onChange={handleChange} /> Active
      </label>
      <button type="submit" className="btn btn-primary">{isEdit ? "Update" : "Create"}</button>
    </form>
  );
}
