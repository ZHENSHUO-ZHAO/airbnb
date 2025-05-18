import { useEffect, useState, useContext } from "react";
import { getRandomListings, searchListings } from "../api/api";
import Dropdown from "../component/Dropdown";
import MandatoryTextInput from "../component/MandatoryTextInput";
import { ToastContext } from "../App";
import Listings from "../component/Listings";

const bedroomOptions = ["", "1", "2", "3", "4+"];

const propertyTypes = [
  "", // represents "Any"
  'Aparthotel',             'Apartment',
  'Barn',                   'Bed and breakfast',
  'Boat',                   'Boutique hotel',
  'Bungalow',               'Cabin',
  'Camper/RV',              'Campsite',
  'Casa particular (Cuba)', 'Castle',
  'Chalet',                 'Condominium',
  'Cottage',                'Earth house',
  'Farm stay',              'Guest suite',
  'Guesthouse',             'Heritage hotel (India)',
  'Hostel',                 'Hotel',
  'House',                  'Houseboat',
  'Hut',                    'Loft',
  'Nature lodge',           'Other',
  'Pension (South Korea)',  'Resort',
  'Serviced apartment',     'Tiny house',
  'Townhouse',              'Train',
  'Treehouse',              'Villa'
];

export default function Home() {
  const { triggerToast } = useContext(ToastContext);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [listings, setListings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [locationInvalid, setLocationInvalid] = useState(false);

  // Fetch random listings on initial load
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await getRandomListings();
      if (data) setListings(data);
      else triggerToast(error.message || "Failed to fetch random listings");
    };
    fetchListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setLocationInvalid(true);
      return;
    } else {
      setLocationInvalid(false);
    }

    const params = {
      market: location,
      ...(propertyType && { property_type: propertyType }),
      ...(bedrooms && { bedrooms })
    };

    const { data, error } = await searchListings(params);
    if (data) {
      setListings(data);
      setHasSearched(true);
    } else triggerToast(error.message || "Failed to load listings");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Search Listings</h2>

      <form className="row g-3 mb-4 align-items-start" onSubmit={handleSubmit}>
        <MandatoryTextInput
          label="Location"
          value={location}
          onChange={setLocation}
          isInvalid={locationInvalid}
          className="col-md-3 d-flex flex-column"
        />

        <Dropdown
          label="Property Type"
          options={propertyTypes}
          value={propertyType}
          onChange={setPropertyType}
          className="col-md-3 d-flex flex-column"
        />

        <Dropdown
          label="Bedrooms"
          options={bedroomOptions}
          value={bedrooms}
          onChange={setBedrooms}
          className="col-md-3 d-flex flex-column"
        />

        <div className="col-md-3 d-flex flex-column">
          <label className="mb-2" style={{ visibility: "hidden" }}>placeholder</label>
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      <Listings listings={listings} hasSearched={hasSearched} />
    </div>
  );
}