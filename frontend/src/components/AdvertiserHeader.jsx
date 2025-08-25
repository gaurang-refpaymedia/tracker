import { BsFiletypeCsv, BsFiletypeExe, BsFiletypePdf, BsFiletypeTsx, BsFiletypeXml, BsPrinter  } from 'react-icons/bs';
import { FiArchive, FiBarChart, FiBell, FiBookOpen, FiBriefcase, FiCheck, FiEye, FiFilter, FiPaperclip, FiPlus, FiSend, FiShield, FiUser, FiWifiOff,FiLayers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Dropdown from './InputComponents/Dropdown';
import { advertiserbuttonData } from '../pages/advertisers/AdvertiserList';
import OffCanvas from './OffCanvas';
import { advertiserFilterColumn } from '../utils/advertiserFilterColumn';

export const fileType = [
  { label: 'PDF', icon: <BsFiletypePdf /> },
  { label: 'CSV', icon: <BsFiletypeCsv /> },
  { label: 'XML', icon: <BsFiletypeXml /> },
  { label: 'Text', icon: <BsFiletypeTsx /> },
  { label: 'Excel', icon: <BsFiletypeExe /> },
  { label: 'Print', icon: <BsPrinter /> },
];

const AdvertiserHeader = () => {
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        <Link to="#" className="btn btn-light-brand" data-bs-toggle="offcanvas" data-bs-target="#advertiserOffcanvas">
          <FiLayers size={16} className="me-2" />
          <span>Filter</span>
        </Link>
        <Dropdown dropdownItems={fileType} triggerPosition={'0, 12'} triggerIcon={<FiPaperclip size={16} strokeWidth={1.6} />} triggerClass="btn btn-icon btn-light-brand" iconStrokeWidth={0} isAvatar={false} />
        <Link to={advertiserbuttonData.href} className="btn btn-primary">
          <FiPlus size={16} className="me-2" />
          <span>{advertiserbuttonData.text}</span>
        </Link>
      </div>
      <OffCanvas canvasId="advertiserOffcanvas" filterAction={advertiserFilterColumn}/>
    </>
  );
};

export default AdvertiserHeader;
