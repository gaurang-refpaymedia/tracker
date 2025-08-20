import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdvertisers } from '../../contextApi/advertiserContext/AdvertiserContext';
import PageHeader from '../../components/PageHeader';

export default function AdvertiserList() {
  const { advertisers, loadAdvertisers, removeAdvertiser, loading, error } = useAdvertisers();

  useEffect(() => {
    loadAdvertisers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    {/* <PageHeader></PageHeader> */}
      <div>
        <h2 className="text-xl font-bold mb-4">Advertisers</h2>
        <Link to="/advertisers/new" className="btn btn-primary">
          + Add Advertiser
        </Link>
        <table className="table-auto w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th>ID</th>
              <th>Email</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisers.length > 0 ? (
              advertisers.map((adv) => (
                <tr key={adv.id} className="border-b">
                  <td>{adv.id}</td>
                  <td>{adv.email}</td>
                  <td>{adv.contact_person}</td>
                  <td>{adv.active_state ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Link to={`/advertisers/${adv.id}`} className="btn btn-sm">
                      View
                    </Link>
                    <Link to={`/advertisers/${adv.id}/edit`} className="btn btn-sm ml-2">
                      Edit
                    </Link>
                    <button onClick={() => removeAdvertiser(adv.id)} className="btn btn-sm ml-2 bg-red-500 text-white">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <p>No Advertiser Found</p>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
