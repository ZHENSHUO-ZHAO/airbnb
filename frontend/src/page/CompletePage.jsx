import { useNavigate } from "react-router-dom";

export default function CompletePage() {
  const navigate = useNavigate();
  return (
    <div>
      Booking Complete!
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}