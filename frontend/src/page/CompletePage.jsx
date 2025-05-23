import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function CompletePage() {
  const { id } = useParams();
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.5 }
    });
  }, []);

  return (
    <div className="container text-center" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh"
    }}>
      <h2>Booking Confirmed</h2>
      <p>Your booking has been successfully submitted.</p>
      <p>Your booking ID is <span className="text-success fw-bold">{id}</span>.</p>
      <Link to="/" className="btn btn-link">Return to Homepage</Link>
    </div>
  );
}