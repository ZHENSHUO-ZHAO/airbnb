import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import MandatoryInput from "../component/MandatoryInput";
import { ToastContext } from "../App";
import { makeBooking } from "../api/api";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerToast } = useContext(ToastContext);

  // State for listingName
  const [listingName, setListingName] = useState(location.state?.listingName || "");

  useEffect(() => {
    if (!listingName) {
      const params = new URLSearchParams(location.search);
      const nameFromQuery = params.get("listingName");
      if (nameFromQuery) {
        setListingName(nameFromQuery);
      }
    }
  }, [location.search, listingName]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let checkInDate, checkOutDate = null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkIn.trim()) {
      setCheckInError("Check-in date is required.");
      valid = false;
    } else {
      checkInDate = new Date(checkIn);
      if (checkInDate < today) {
        setCheckInError("Check In date cannot be earlier than today.");
        valid = false;
      } else {
        setCheckInError("");
      }
    }

    if (!checkOut.trim()) {
      setCheckOutError("Check-out date is required.");
      valid = false;
    } else {
      checkOutDate = new Date(checkOut);
      if (checkOutDate < today) {
        setCheckOutError("Check Out date cannot be earlier than today.");
        valid = false;
      } else {
        setCheckOutError("");
      }
    }

    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      setCheckOutError("Check Out date must be after Check In date.");
      valid = false;
    }

    if (!name.trim()) {
      setNameError("Name is required.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError("Email address is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!mobile.trim()) {
      setMobileError("Mobile number is required.");
      valid = false;
    } else if (mobile && !/^\d+$/.test(mobile)) {
      setMobileError("Mobile number must contain only digits.");
      valid = false;
    } else {
      setMobileError("");
    }

    if (valid) {
      setLoading(true);
      const bookingPayload = {
        listingID: id,
        startDate: checkIn,
        endDate: checkOut,
        name,
        emailAddress: email,
        mobileNumber: mobile,
        postalAddress,
        homeAddress: residentialAddress,
      };

      makeBooking(bookingPayload).then(({ data, error }) => {
        setLoading(false);
        if (error) {
          triggerToast(error.response?.data?.error || "Booking failed.");
        } else {
          navigate(`/complete/${data.bookingId}`);
        }
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Book the Property
        <br />
        <span className="text-success">Listing ID: {id}</span>
        {listingName && (
          <>
            <br />
            <span className="text-success">Name: {listingName}</span>
          </>
        )}
      </h2>
      <form onSubmit={handleSubmit}>
        <h4 className="text-primary">Booking Details</h4>
        <div className="row mb-3">
          <div className="col-md-6">
            <MandatoryInput
              label="Check In Date"
              value={checkIn}
              onChange={(val) => setCheckIn(val.trim())}
              placeholder="Enter check-in date"
              inputType="date"
              invalidMessage={checkInError}
            />
          </div>
          <div className="col-md-6">
            <MandatoryInput
              label="Check Out Date"
              value={checkOut}
              onChange={(val) => setCheckOut(val.trim())}
              placeholder="Enter check-out date"
              inputType="date"
              invalidMessage={checkOutError}
            />
          </div>
        </div>

        <h4 className="mt-4 text-primary">Your Details</h4>
        <div className="mb-3">
          <MandatoryInput
            label="Your Name"
            value={name}
            onChange={setName}
            placeholder="Please enter your name."
            invalidMessage={nameError}
          />
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <MandatoryInput
              label="Email Address"
              value={email}
              onChange={setEmail}
              placeholder="Please enter your email address."
              invalidMessage={emailError}
            />
          </div>
          <div className="col-md-6">
            <MandatoryInput
              label="Mobile No"
              value={mobile}
              onChange={setMobile}
              placeholder="Please enter your mobile no (04xxxx xxx xxx)."
              inputType="tel"
              inputMode="numeric"
              invalidMessage={mobileError}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Postal Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Please provide your postal address."
            value={postalAddress}
            onChange={(e) => setPostalAddress(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Residential Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Please provide your residential address (cannot be a post box address)."
            value={residentialAddress}
            onChange={(e) => setResidentialAddress(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-6">
            <button type="button" className="btn btn-danger w-100" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
          <div className="col-6">
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              Book Now
            </button>
          </div>
        </div>
      </form>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="fs-5 text-primary">We're processing your booking...</div>
          </div>
        </div>
      )}
    </div>
  );
}