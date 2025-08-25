import React from 'react';
import getIcon from '../utils/getIcon';

const AdvertiserView = ({ advertiser }) => {
  const transformAdvertiserToViewData = (advertiser) => [
    { title: 'Advertiser Code', content: advertiser.advcode },
    { title: 'Email', content: <a href={`mailto:${advertiser.email}`}>{advertiser.email}</a> },
    { title: 'Company Code', content: advertiser.company.name },
    { title: 'Token', content: advertiser.token },
    { title: 'Status', content: advertiser.adv_status.label || 'Unknown' },
    { title: 'Country ID', content: advertiser.adv_country.name },
    { title: 'State ID', content: advertiser.adv_state.name },
    { title: 'Timezone ID', content: advertiser.adv_timezone.code },
    { title: 'Active State', content: advertiser.active_state ? 'Yes' : 'No' },
  ];

  const viewData = advertiser ? transformAdvertiserToViewData(advertiser) : [];
  return (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
      <div className="card card-body lead-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">
            <span className="d-block mb-2">Advertiser Information :</span>
            <span className="fs-12 fw-normal text-muted d-block">Following information for your Advertiser</span>
          </h5>
        </div>
        {viewData?.map((data, index) => (
          <Card key={index} title={data.title} content={data.content} />
        ))}
      </div>
    </div>
  );
};

export default AdvertiserView;

const Card = ({ title, content }) => {
  return (
    <div className="row mb-4">
      <div className="col-lg-2 fw-medium">{title}</div>
      <div className="col-lg-10">{content}</div>
    </div>
  );
};
