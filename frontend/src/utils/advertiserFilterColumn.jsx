import {
  FiEye, // For 'All'
  FiTag, // For 'id'
  FiHash, // For 'advcode'
  FiGlobe, // For 'adv_country_id'
  FiAlertCircle, // For 'adv_status_id' (general status)
  FiMap, // For 'adv_state_id'
  FiClock, // For 'adv_timezone_id'
  FiUserCheck, // For 'role_code'
  FiUserPlus, // For 'created_by'
  FiMail, // For 'email'
  FiUser, // For 'contact_person'
  FiPhone, // For 'contact_number'
  FiKey, // For 'token'
  FiDollarSign, // For 'currency'
  FiMapPin, // For 'address'
  FiCheckCircle, // For 'Active'
  FiMinusCircle, // For 'Inactive'
} from 'react-icons/fi';

export const advertiserFilterColumn = [
  { label: 'All Filters', value: 'All', icon: <FiEye /> },
  { label: 'Advertiser ID', value: 'id', icon: <FiTag /> },
  { label: 'Advertiser Code', value: 'advcode', icon: <FiHash /> },
  { label: 'Country', value: 'adv_country', icon: <FiGlobe /> },
  { label: 'Status', value: 'adv_status', icon: <FiAlertCircle /> },
  { label: 'State', value: 'adv_state', icon: <FiMap /> },
  { label: 'Timezone', value: 'adv_timezone', icon: <FiClock /> },
  { label: 'Company Code', value: 'company', icon: <FiGlobe /> },
  { label: 'Role Code', value: 'role_code', icon: <FiUserCheck /> },
  { label: 'Created By', value: 'created_by', icon: <FiUserPlus /> },
  { label: 'Email', value: 'email', icon: <FiMail /> },
  { label: 'Contact Person', value: 'contact_person', icon: <FiUser /> },
  { label: 'Contact Number', value: 'contact_number', icon: <FiPhone /> },
  { label: 'Token', value: 'token', icon: <FiKey /> },
  { label: 'Currency', value: 'currency', icon: <FiDollarSign /> },
  { label: 'Address', value: 'address', icon: <FiMapPin /> },
  { label: 'Active', value: 'Active', icon: <FiCheckCircle /> },
  { label: 'Inactive', value: 'Inactive', icon: <FiMinusCircle /> },
];

// export default initialAdvertiserColumn [('id', 'advcode', 'adv_country', 'adv_company', 'email', 'adv_status')];
