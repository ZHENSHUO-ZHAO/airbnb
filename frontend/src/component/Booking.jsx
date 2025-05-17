import { useParams } from "react-router-dom";

export default function BookingPage() {
  const { id } = useParams();
  return <div>Booking page for listing: {id}</div>;
}