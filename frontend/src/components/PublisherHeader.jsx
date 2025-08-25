import React from 'react';
import { FiArchive, FiBarChart, FiBell, FiBookOpen, FiBriefcase, FiCheck, FiEye, FiFilter, FiPaperclip, FiPlus, FiSend, FiShield, FiUser, FiWifiOff,FiLayers } from 'react-icons/fi';
import { BsFiletypeCsv, BsFiletypeExe, BsFiletypePdf, BsFiletypeTsx, BsFiletypeXml, BsPrinter } from 'react-icons/bs';
// import Dropdown from '@/components/shared/Dropdown';
import { Link } from 'react-router-dom';
import Dropdown from './InputComponents/Dropdown';
import { publisherbuttonData } from '../pages/publishers/PublisherList';
import OffCanvas from './OffCanvas';
import { publisherFilterColumn } from '../utils/publisherFilterColumn';


export const filterAction = [
  { label: 'All', icon: <FiEye /> },
  { label: 'Sent', icon: <FiSend /> },
  { label: 'Open', icon: <FiBookOpen /> },
  { label: 'Draft', icon: <FiArchive /> },
  { label: 'Revised', icon: <FiBell /> },
  { label: 'Declined', icon: <FiShield /> },
  { label: 'Accepted', icon: <FiCheck /> },
  { label: 'Leads', icon: <FiBriefcase /> },
  { label: 'Expired', icon: <FiWifiOff /> },
  { label: 'Customers', icon: <FiUser /> },
];
export const fileType = [
  { label: 'PDF', icon: <BsFiletypePdf /> },
  { label: 'CSV', icon: <BsFiletypeCsv /> },
  { label: 'XML', icon: <BsFiletypeXml /> },
  { label: 'Text', icon: <BsFiletypeTsx /> },
  { label: 'Excel', icon: <BsFiletypeExe /> },
  { label: 'Print', icon: <BsPrinter /> },
];

const PublisherHeader = () => {
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        <Link to="#" className="btn btn-light-brand" data-bs-toggle="offcanvas" data-bs-target="#publisherOffcanvas">
          <FiLayers size={16} className="me-2" />
          <span>Filter</span>
        </Link>
        <Dropdown dropdownItems={fileType} triggerPosition={'0, 12'} triggerIcon={<FiPaperclip size={16} strokeWidth={1.6} />} triggerClass="btn btn-icon btn-light-brand" iconStrokeWidth={0} isAvatar={false} />
        <Link to={publisherbuttonData.href} className="btn btn-primary">
          <FiPlus size={16} className="me-2" />
          <span>{publisherbuttonData.text}</span>
        </Link>
      </div>
      <OffCanvas canvasId="publisherOffcanvas" filterAction={publisherFilterColumn}/>
    </>
  );
};

export default PublisherHeader;
