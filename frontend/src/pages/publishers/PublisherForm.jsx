import { useNavigate, useParams } from 'react-router-dom';
import { usePublishers } from '../../contextApi/publisherContext/PublisherContext';
import { useEffect, useState } from 'react';
import SelectDropdown from '../../components/InputComponents/SelectDropdown';
import Input from '../../components/InputComponents/Input';
import { DataContext } from '../../contextApi/DataContext';
import { useContext } from 'react';

export default function PublisherForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { addPublisher, editPublisher, loadPublisher, publisher, error } = usePublishers();
  const { countries, countriesItems, states, statesItems, statuses, statusesItems, timezones, timezonesItems } = useContext(DataContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pubcode: '',
    pub_country_id: null,
    pub_status_id: null,
    pub_state_id: null,
    pub_timezone_id: null,
    token: '',
    email: '',
    contact_number: '',
    contact_person: '',
    currency: '',
    address: '',
    active_state: true,
  });

  useEffect(() => {
    countriesItems();
    statesItems();
    statusesItems();
    timezonesItems();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadPublisher(id);
    }
  }, [id]);

  useEffect(() => {
    if (publisher && isEdit) {
      setFormData({
        pubcode: publisher.pubcode || '',
        email: publisher.email || '',
        token: publisher.token || '',
        contact_number: publisher.contact_number || '',
        contact_person: publisher.contact_person || '',
        currency: publisher.currency || '',
        address: publisher.address || '',
        pub_country_id: publisher.pub_country?.id || null,
        pub_state_id: publisher.pub_state?.id || null,
        pub_status_id: publisher.pub_status?.id || null,
        pub_timezone_id: publisher.pub_timezone?.id || null,
        active_state: publisher.active_state ?? true, // ✅ pick from API or fallback
      });
    }
  }, [publisher, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      contact_person: formData.contact_person?.trim() || '',
      currency: formData.currency?.trim() || '',
      address: formData.address?.trim() || '',
      active_state: formData.active_state,
    }

    if (isEdit) {
      editPublisher(id, payload);
    } else {
      addPublisher(payload);
    }

    if (!error) {
      navigate('/publishers');
    }
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="card stretch stretch-full">
          <div className="card-body lead-status">
            <div className="mb-3 d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 me-4">
                <span className="d-block mb-2">{isEdit ? 'Update Publisher' : 'Create Publisher'} :</span>

                <span className="fs-12 fw-normal text-muted text-truncate-1-line">Typically refers to adding a new potential customer or sales prospect</span>
              </h5>
            </div>

            <div className="row">
              <div className="col-12">
                {error && (
                  <>
                    {Array.isArray(error?.detail) ? (
                      error.detail.map((err, idx) => (
                        <p key={idx} className="text-danger">
                          {err.msg || JSON.stringify(err)}
                        </p>
                      ))
                    ) : (
                      <p className="text-danger">{error?.detail}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <label className="form-label">Publisher Code</label>

                  <Input label={'Publisher Code'} onChange={handleChange} labelId={'pubcode'} placeholder={'Publisher Code'} name={'pubcode'} value={formData.pubcode} />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">Email</label>

                  <Input label={'Email'} onChange={handleChange} labelId={'email'} placeholder={'Email'} name={'email'} value={formData.email} />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">Token</label>

                  <Input label={'Token'} onChange={handleChange} labelId={'token'} placeholder={'Token'} name={'token'} value={formData.token} />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">Country</label>

                  <SelectDropdown
                    options={countries.map((c) => ({ value: c.id, label: c.name }))}
                    selectedOption={countries.find((c) => c.id === formData.pub_country_id) ? { value: formData.pub_country_id, label: countries.find((c) => c.id === formData.pub_country_id).name } : null}
                    defaultSelect="Select Country"
                    onSelectOption={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        pub_country_id: option.value,
                      }))
                    }
                  />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">States</label>

                  <SelectDropdown
                    options={states.map((c) => ({ value: c.id, label: c.name }))}
                    selectedOption={states.find((c) => c.id === formData.pub_state_id) ? { value: formData.pub_state_id, label: states.find((c) => c.id === formData.pub_state_id).name } : null}
                    defaultSelect="Select State"
                    onSelectOption={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        pub_state_id: option.value,
                      }))
                    }
                  />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">Status</label>

                  <SelectDropdown
                    options={statuses.map((c) => ({ value: c.id, label: c.label }))}
                    selectedOption={statuses.find((c) => c.id === formData.pub_status_id) ? { value: formData.pub_status_id, label: statuses.find((c) => c.id === formData.pub_status_id).label } : null}
                    defaultSelect="Select Status"
                    onSelectOption={(option) =>
                      setFormData((prev) => ({
                        ...prev,

                        pub_status_id: option.value,
                      }))
                    }
                  />
                </div>

                <div className="col-lg-4 mb-4">
                  <label className="form-label">Timezones</label>

                  <SelectDropdown
                    options={timezones.map((c) => ({ value: c.id, label: c.code }))}
                    selectedOption={timezones.find((c) => c.id === formData.pub_timezone_id) ? { value: formData.pub_timezone_id, label: timezones.find((c) => c.id === formData.pub_timezone_id).code } : null}
                    defaultSelect="Select timezones"
                    onSelectOption={(option) =>
                      setFormData((prev) => ({
                        ...prev,

                        pub_timezone_id: option.value,
                      }))
                    }
                  />
                </div>

                <div className="col-lg-4 mb-4">
                <label className="form-label">Contact Number</label>
                <Input
                  label="Contact Number"
                  onChange={handleChange}
                  labelId="contact_number"
                  placeholder="Contact Number"
                  name="contact_number"
                  value={formData.contact_number}
                />
              </div>

              {/* Contact Person */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Contact Person</label>
                <Input
                  label="Contact Person"
                  onChange={handleChange}
                  labelId="contact_person"
                  placeholder="Contact Person"
                  name="contact_person"
                  value={formData.contact_person}
                />
              </div>

              {/* Currency */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Currency</label>
                <Input
                  label="Currency"
                  onChange={handleChange}
                  labelId="currency"
                  placeholder="Currency"
                  name="currency"
                  value={formData.currency}
                />
              </div>

              {/* Address */}
              <div className="col-lg-8 mb-4">
                <label className="form-label">Address</label>
                <Input
                  label="Address"
                  onChange={handleChange}
                  labelId="address"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                />
              </div>

              {/* Active State */}
              <div className="col-lg-4 mb-4 d-flex align-items-center">
                <label className="form-label me-3">Active</label>
                <input
                  type="checkbox"
                  name="active_state"
                  checked={formData.active_state}
                  onChange={handleChange}
                />
              </div>
              </div>

              <div className="row">
                <button type="submit" className="btn btn-primary">
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
