import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePublishers } from "../../contextApi/publisherContext/PublisherContext";
import PublisherView from "../../components/PublisherView";


export default function PublisherDetail() {
  const { id } = useParams();
  const { publisher, loadPublisher, loading } = usePublishers();

  useEffect(() => {
    loadPublisher(id);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!publisher) return <p>No publisher found</p>;

  return (
    <PublisherView publisher={publisher}/>
  );
}
