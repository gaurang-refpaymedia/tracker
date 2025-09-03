import React, { useEffect } from 'react';
import { FiArchive, FiEdit, FiEye,FiTrash  } from 'react-icons/fi';
import Table from './Table';
import { Link } from 'react-router-dom';
import { usePublishers } from '../contextApi/publisherContext/PublisherContext';
import { FiBell, FiBookOpen, FiBriefcase, FiCheck, FiSend, FiShield, FiUser, FiWifiOff } from 'react-icons/fi'
import { useFilter } from '../contextApi/FilterContext';

const statusColors = {
  1: { label: 'Active', className: 'badge bg-success' },
  2: { label: 'Inactive', className: 'badge bg-danger' },
  3: { label: 'Pending', className: 'badge bg-warning' },
  4: { label: 'Suspended', className: 'badge bg-info' },
  5: { label: 'Deleted', className: 'badge bg-secondary' },
};

export const tableColumnFilter = [
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

const PublisherTable = ({ publishers }) => {
  const { removePublisher } = usePublishers();

  const {selectedFilters} = useFilter();

  const allColumns = [
    {
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = React.useRef(null);

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
          }
        }, [table.getIsSomeRowsSelected()]);

        return <input type="checkbox" className="custom-table-checkbox" ref={checkboxRef} checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />;
      },
      cell: ({ row }) => <input type="checkbox" className="custom-table-checkbox" checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} />,
      meta: {
        headerClassName: 'width-30',
      },
    },
    {
      accessorKey: 'pubcode',
      header: () => 'Code',
      meta: { className: 'font-bold text-gray-800' },
      label: 'Publisher Code',
    },
    {
      accessorKey: 'company',
      header: () => 'Company',
      cell: (info) => info.getValue()?.name || '',
      label: 'Company Name',
    },
    {
      accessorKey: 'email',
      header: () => 'Email',
      cell: (info) => <Link to={`mailto:${info.getValue()}`}>{info.getValue()}</Link>,
    },
    {
      accessorKey: 'pub_status',
      header: () => 'Status',
      cell: (info) => {
        const statusObj = info.getValue(); // e.g. 1,2,3...
        const status = statusColors[statusObj?.id] || { label: statusObj?.label || 'Unknown', className: 'badge bg-light text-dark' };

        return <span className={status.className}>{status.label}</span>;
      },
      meta: {
        className: 'fw-bold text-dark',
      },
    },
    {
      accessorKey: 'pub_country',
      header: () => 'Country',
      cell: (info) => info.getValue()?.name || '',
      label: 'Country',
    },
    {
      accessorKey: 'pub_state',
      header: () => 'State',
      cell: (info) => info.getValue()?.name || '',
      label: 'State',
    },
    {
      accessorKey: 'pub_timezone',
      header: () => 'Timezone',
      cell: (info) => info.getValue()?.code || '',
      label: 'Timezone',
    },
    {
      accessorKey: 'role',
      header: () => 'Role',
      cell: (info) => info.getValue()?.code || '',
      label: 'Role Code',
    },
    {
      accessorKey: 'created_user',
      header: () => 'Created By',
      cell: (info) => info.getValue()?.name || '',
      label: 'Created By',
    },
    {
      accessorKey: 'contact_person',
      header: () => 'Contact Person',
      label: 'Contact Person',
    },
    {
      accessorKey: 'contact_number',
      header: () => 'Contact Number',
      label: 'Contact Number',
    },
    {
      accessorKey: 'token',
      header: () => 'Token',
      label: 'Token',
    },
    {
      accessorKey: 'currency',
      header: () => 'Currency',
      label: 'Currency',
    },
    {
      accessorKey: 'active_state',
      header: () => 'Active State',
      cell: (info) => {
        const isActive = info.getValue();
        return <span className={`badge px-2 py-1 rounded-full small fw-bold ${isActive ? 'bg-primary text-white' : 'bg-danger text-white'}`}>{isActive ? 'Active' : 'Inactive'}</span>;
      },
      label: 'Active State',
    },
    {
      accessorKey: 'address',
      header: () => 'Address',
      label: 'Address',
    },

    {
      accessorKey: 'actions',
      header: () => 'Actions',
      cell: (info) => {
        const publisher = info.row.original;
        return (
          <div className="hstack gap-2 justify-content-end">
            <Link to={`/publishers/${publisher.id}`} className="avatar-text avatar-md">
              <FiEye />
            </Link>
            <Link to={`/publishers/${publisher.id}/edit`} className="avatar-text avatar-md">
              <FiEdit />
            </Link>
            <button onClick={() => removePublisher(publisher.id)} className="avatar-text avatar-md">
              <FiTrash />
            </button>
          </div>
        );
      },

      meta: {
        headerClassName: 'text-end',
      },
    },
  ];

  const filterColumns = allColumns.filter(col => {
    if(col.accessorKey === 'id' || col.accessorKey === 'actions'){
      return true;
    }

    return selectedFilters.includes(col.accessorKey);
  })
  return (
    <>
      <Table data={publishers} columns={filterColumns} />
    </>
  );
};

export default PublisherTable;
