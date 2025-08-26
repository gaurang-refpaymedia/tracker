import { useNavigate, useParams } from 'react-router-dom';
import { useAdvertisers } from '../../contextApi/advertiserContext/AdvertiserContext';
import { useEffect, useState, useContext } from 'react';
import SelectDropdown from '../../components/InputComponents/SelectDropdown';
import Input from '../../components/InputComponents/Input';
import { DataContext } from '../../contextApi/DataContext';

export default function AdvertiserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { addAdvertiser, editAdvertiser, loadAdvertiser, advertiser, error } = useAdvertisers();

  const {
    countries, countriesItems,
    states, statesItems,
    statuses, statusesItems,
    timezones, timezonesItems
  } = useContext(DataContext);

  const [formData, setFormData] = useState({
    advcode: '',
    adv_country_id: null,
    adv_state_id: null,
    adv_status_id: null,
    adv_timezone_id: null,
    token: '',
    email: '',
    contact_number: '',
    contact_person: '',
    currency: '',
    address: '',
    active_state: true,   // ✅ default true
  });

  // Load dropdown data
  useEffect(() => {
    countriesItems();
    statesItems();
    statusesItems();
    timezonesItems();
  }, []);

  // Load advertiser if edit mode
  useEffect(() => {
    if (isEdit) loadAdvertiser(id);
  }, [id]);

  // Populate formData on advertiser load
  useEffect(() => {
    if (advertiser && isEdit) {
      setFormData({
        advcode: advertiser.advcode || '',
        email: advertiser.email || '',
        token: advertiser.token || '',
        contact_number: advertiser.contact_number || '',
        contact_person: advertiser.contact_person || '',
        currency: advertiser.currency || '',
        address: advertiser.address || '',
        adv_country_id: advertiser.adv_country?.id || null,
        adv_state_id: advertiser.adv_state?.id || null,
        adv_status_id: advertiser.adv_status?.id || null,
        adv_timezone_id: advertiser.adv_timezone?.id || null,
        active_state: advertiser.active_state ?? true, // ✅ pick from API or fallback
      });
    }
  }, [advertiser, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      contact_person: formData.contact_person?.trim() || '', // required
      currency: formData.currency?.trim() || '',             // required
      address: formData.address?.trim() || '',               // required
      active_state: formData.active_state,                   // ensure boolean
    };

    console.log('payload', payload);

    if (isEdit) {
      editAdvertiser(id, payload);
    } else {
      addAdvertiser(payload);
    }

    // if (!error) navigate('/advertisers');
  };

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <div className="card-body lead-status">
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <h5 className="fw-bold mb-0 me-4">
              <span className="d-block mb-2">{isEdit ? 'Update Advertiser' : 'Create Advertiser'} :</span>
              <span className="fs-12 fw-normal text-muted text-truncate-1-line">
                Typically refers to adding a new potential customer or sales prospect
              </span>
            </h5>
          </div>

          {/* Error messages */}
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
              {/* Advertiser Code */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Advertiser Code</label>
                <Input
                  label="Advertiser Code"
                  onChange={handleChange}
                  labelId="advcode"
                  placeholder="Advertiser Code"
                  name="advcode"
                  value={formData.advcode}
                />
              </div>

              {/* Email */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Email</label>
                <Input
                  label="Email"
                  onChange={handleChange}
                  labelId="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                />
              </div>

              {/* Token */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Token</label>
                <Input
                  label="Token"
                  onChange={handleChange}
                  labelId="token"
                  placeholder="Token"
                  name="token"
                  value={formData.token}
                />
              </div>

              {/* Country */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Country</label>
                <SelectDropdown
                  options={countries.map((c) => ({ value: c.id, label: c.name }))}
                  selectedOption={countries.find((c) => c.id === formData.adv_country_id) ? { value: formData.adv_country_id, label: countries.find((c) => c.id === formData.adv_country_id).name } : null}
                  defaultSelect="Select Country"
                  onSelectOption={(option) => setFormData((prev) => ({ ...prev, adv_country_id: option.value }))}
                />
              </div>

              {/* State */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">State</label>
                <SelectDropdown
                  options={states.map((s) => ({ value: s.id, label: s.name }))}
                  selectedOption={states.find((s) => s.id === formData.adv_state_id) ? { value: formData.adv_state_id, label: states.find((s) => s.id === formData.adv_state_id).name } : null}
                  defaultSelect="Select State"
                  onSelectOption={(option) => setFormData((prev) => ({ ...prev, adv_state_id: option.value }))}
                />
              </div>

              {/* Status */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Status</label>
                <SelectDropdown
                  options={statuses.map((s) => ({ value: s.id, label: s.label }))}
                  selectedOption={statuses.find((s) => s.id === formData.adv_status_id) ? { value: formData.adv_status_id, label: statuses.find((s) => s.id === formData.adv_status_id).label } : null}
                  defaultSelect="Select Status"
                  onSelectOption={(option) => setFormData((prev) => ({ ...prev, adv_status_id: option.value }))}
                />
              </div>

              {/* Timezone */}
              <div className="col-lg-4 mb-4">
                <label className="form-label">Timezone</label>
                <SelectDropdown
                  options={timezones.map((t) => ({ value: t.id, label: t.code }))}
                  selectedOption={timezones.find((t) => t.id === formData.adv_timezone_id) ? { value: formData.adv_timezone_id, label: timezones.find((t) => t.id === formData.adv_timezone_id).code } : null}
                  defaultSelect="Select Timezone"
                  onSelectOption={(option) => setFormData((prev) => ({ ...prev, adv_timezone_id: option.value }))}
                />
              </div>

              {/* Contact Number */}
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
  );
}
