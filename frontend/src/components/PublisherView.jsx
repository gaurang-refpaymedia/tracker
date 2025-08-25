import React from 'react';
import getIcon from '../utils/getIcon';

const PublisherView = ({ publisher }) => {
  const transformPublisherToViewData = (publisher) => [
    { title: 'Publisher Code', content: publisher.pubcode },
    { title: 'Email', content: <a href={`mailto:${publisher.email}`}>{publisher.email}</a> },
    { title: 'Company Code', content: publisher.company_code },
    { title: 'Token', content: publisher.token },
    { title: 'Status', content: publisher.pub_status_id || 'Unknown' },
    { title: 'Country ID', content: publisher.pub_country_id },
    { title: 'State ID', content: publisher.pub_state_id },
    { title: 'Timezone ID', content: publisher.pub_timezone_id },
    { title: 'Active State', content: publisher.active_state ? 'Yes' : 'No' },
  ];

  const viewData = publisher ? transformPublisherToViewData(publisher) : [];
  return (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
      <div className="card card-body lead-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">Publisher Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">Following information for your Publisher</span>
          </h5>
        </div>
        {viewData?.map((data, index) => (
          <Card key={index} title={data.title} content={data.content} />
        ))}
      </div>
    </div>
  );
};

export default PublisherView;

const Card = ({ title, content }) => {
  return (
    <div className="row mb-4">
      <div className="col-lg-2 fw-medium">{title}</div>
      <div className="col-lg-10">{content}</div>
    </div>
  );
};
