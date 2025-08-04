import React, { useEffect, useState, useContext } from "react";
import { FiCalendar, FiCamera } from "react-icons/fi";
import getIcon from "../utils/getIcon";
import Input from "./InputComponents/Input";
import SelectDropdown from "./InputComponents/SelectDropdown";
import useLocationData from "../customHooks/useLocationData";
import { FormDataContext } from "../contextApi/FormDataContext";
import { AuthContext } from "../contextApi/AuthContext";

const CreateSubUserForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role_code: "",
  });

  const { countries, fetchCountries } = useLocationData();
  const { createSubUser,subUser } = useContext(FormDataContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchCountries();
  }, []);

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
    try {
      await createSubUser(
        formData.name,
        formData.email,
        formData.role_code,
        user.role_code,
        user.user_code
      );
      setFormData({
        name: "",
        email: "",
        role_code: "",
      });
      setSelectedOption(null);
      alert("Sub-user created successfully!");
    } catch (error) {
      console.error("Failed to create sub-user:", error);
      alert("Failed to create sub-user. Please try again.");
    }
  };

  const roleOptions = [
    { "label": "Super Admin", "value": "SUPER_ADMIN" },
    { "label": "Admin", "value": "ADMIN" },
    { "label": "Sub-Admin", "value": "SUB_ADMIN" },
    { "label": "Publisher Manager", "value": "PUB_MANAGER" },
    { "label": "Publisher Executive", "value": "PUB_EXEC" },
    { "label": "Advertiser Manager", "value": "ADV_MANAGER" },
    { "label": "Advertiser Executive", "value": "ADV_EXEC" },
    { "label": "Financial Manager", "value": "FIN_MANAGER" },
    { "label": "Financial Executive", "value": "FIN_EXEC" },
    { "label": "Viewer", "value": "VIEWER" }
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
          {
            subUser ? subUser.generatedPassword :"not generated"
          }
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
                <label htmlFor="name" className="fw-semibold">Name: </label>
            </div>
            <div className="col-lg-8">
                <div className="input-group">
                    <div className="input-group-text">{getIcon("feather-user")}</div>
                    <input type="text" name="name" className="form-control" id="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                </div>
            </div>
          </div>
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
                <label htmlFor="email" className="fw-semibold">Email: </label>
            </div>
            <div className="col-lg-8">
                <div className="input-group">
                    <div className="input-group-text">{getIcon("feather-mail")}</div>
                    <input type="email" name="email" className="form-control" id="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                </div>
            </div>
          </div>
          <div className="row mb-4 align-items-center">
            <div className="col-lg-4">
              <label className="fw-semibold">Role: </label>
            </div>
            <div className="col-lg-8">
              {/* This dropdown currently shows countries, but for sub-users,
                  you might want to show roles or another relevant selection.
                  Assuming it's meant for roles based on `role_code` in backend.
                  If it's truly for 'State' (location), you'd need to adjust the backend schema.
                  For now, I'm adapting it to select a 'Role'. */}
              <SelectDropdown
                options={roleOptions} // Using roleOptions for demonstration
                selectedOption={selectedOption}
                defaultSelect={"Select Role"} // Change default select text
                onSelectOption={handleRoleSelect}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Create Sub User
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateSubUserForm;
