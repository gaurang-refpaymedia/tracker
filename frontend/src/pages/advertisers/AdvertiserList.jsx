import { useEffect } from 'react';
import { href, Link } from 'react-router-dom';
import { useAdvertisers } from '../../contextApi/advertiserContext/AdvertiserContext';
import PageHeader from '../../components/PageHeader';
import AdvertiserHeader from '../../components/AdvertiserHeader';
import AdvertiserTable from '../../components/AdvertiserTable';

export const advertiserbuttonData = {
  text: 'Add Advertiser',
  href: '/advertisers/new',
};

export default function AdvertiserList() {
  const { advertisers, loadAdvertisers, removeAdvertiser, loading, error } = useAdvertisers();

  useEffect(() => {
    loadAdvertisers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <PageHeader>
        <AdvertiserHeader />
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <AdvertiserTable advertisers={advertisers} />
        </div>
      </div>
    </>
  );
}
