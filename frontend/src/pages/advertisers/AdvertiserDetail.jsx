import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdvertisers } from "../../contextApi/advertiserContext/AdvertiserContext";


export default function AdvertiserDetail() {
  const { id } = useParams();
  const { advertiser, loadAdvertiser, loading } = useAdvertisers();

  useEffect(() => {
    loadAdvertiser(id);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!advertiser) return <p>No advertiser found</p>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Advertiser Detail</h2>
      <p><strong>ID:</strong> {advertiser.id}</p>
      <p><strong>Email:</strong> {advertiser.email}</p>
      <p><strong>Contact Person:</strong> {advertiser.contact_person}</p>
      <p><strong>Currency:</strong> {advertiser.currency}</p>
      <p><strong>Status:</strong> {advertiser.active_state ? "Active" : "Inactive"}</p>
    </div>
  );
}
