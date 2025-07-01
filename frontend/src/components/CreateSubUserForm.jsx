import React, { useEffect, useState, useContext } from "react";
import { FiCalendar, FiCamera } from "react-icons/fi";
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
    // We won't send password from here, it's generated on the backend
    role_code: "", // This will likely come from a dropdown of roles
    // user_code is generated on the backend
  });

  const { countries, fetchCountries } = useLocationData();
  const { createSubUser } = useContext(FormDataContext);
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
      role_code: option.value, // Assuming option has a 'value' property for the role code
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // The backend generates the password and user_code, so we don't send them from the frontend.
    // The `createSubUser` function in `formDataContext` takes `name`, `email`, `password`, `roleCode`, `userCode`.
    // However, looking at your backend, it doesn't expect `password` or `userCode` from the frontend for `create_sub_user`.
    // It generates them. So we should only pass `name`, `email`, and `role_code`.

    // Assuming a placeholder for password and userCode since the context function expects them,
    // but the backend will ignore them if it generates its own.
    // It's better to align the `createSubUser` function in `formDataContext.jsx` with what the backend actually expects.

    // Let's refine `createSubUser` call based on your backend:
    // It expects `name`, `email`, `role_code`.
    // `hashed_password` and `user_code` are generated in the backend.

    try {
      await createSubUser(
        formData.name,
        formData.email,
        formData.role_code,
        user.user_code
      );
      // Optionally, clear the form or show a success message
      setFormData({
        name: "",
        email: "",
        role_code: "",
      });
      setSelectedOption(null); // Clear selected dropdown
      alert("Sub-user created successfully!");
    } catch (error) {
      console.error("Failed to create sub-user:", error);
      alert("Failed to create sub-user. Please try again.");
    }
  };

  // Example role options (you would fetch these from an API in a real application)
  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Viewer", value: "viewer" },
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
          <Input
            icon="feather-user"
            label={"Name"}
            labelId={"nameInput"}
            placeholder={"Name"}
            name={"name"}
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            icon="feather-mail"
            label={"Email"}
            labelId={"emailInput"}
            placeholder={"Email"}
            name={"email"}
            type={"email"}
            value={formData.email}
            onChange={handleChange}
          />
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
