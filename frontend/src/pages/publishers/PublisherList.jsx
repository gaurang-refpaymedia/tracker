import { useEffect } from 'react';
import { href, Link } from 'react-router-dom';
import { usePublishers } from '../../contextApi/publisherContext/PublisherContext';
import PageHeader from '../../components/PageHeader';
import PublisherHeader from '../../components/PublisherHeader';
import PublisherTable from '../../components/PublisherTable';

export const publisherbuttonData = {
  text: 'Add Publisher',
  href: '/publishers/new',
};

export default function PublisherList() {
  const { publishers, loadPublishers, removePublisher, loading, error } = usePublishers();

  useEffect(() => {
    loadPublishers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <PageHeader>
        <PublisherHeader />
      </PageHeader>
      <div className="main-content">
        <div className="row">
          <PublisherTable publishers={publishers} />
        </div>
      </div>
    </>
  );
}
