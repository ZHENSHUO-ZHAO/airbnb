import { Link } from "react-router-dom";

export default function CompletePage() {
  return (
    <div className="container mt-5 text-center">
      <h2>Booking Confirmed</h2>
      <p>Your booking has been successfully submitted.</p>
      <Link to="/" className="btn btn-link">Return to Homepage</Link>
    </div>
  );
}