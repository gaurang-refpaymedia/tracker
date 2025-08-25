import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdvertisers } from "../../contextApi/advertiserContext/AdvertiserContext";
import AdvertiserView from "../../components/AdvertiserView";


export default function AdvertiserDetail() {
  const { id } = useParams();
  const { advertiser, loadAdvertiser, loading } = useAdvertisers();

  useEffect(() => {
    loadAdvertiser(id);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!advertiser) return <p>No advertiser found</p>;

  return (
    <AdvertiserView advertiser={advertiser}/>
  );
}
