import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { getRandomListings, searchListings } from "../api/api";

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
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [listings, setListings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [flashLocation, setFlashLocation] = useState(false);
  const [locationInvalid, setLocationInvalid] = useState(false);

  // Fetch random listings on initial load
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await getRandomListings();
      if (data) setListings(data);
      else console.error(error);
    };
    fetchListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setLocationInvalid(true);
      setFlashLocation(true);
      setTimeout(() => setFlashLocation(false), 2000);
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
    } else console.error(error);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Search Listings</h2>

      <form className="row g-3 mb-4 align-items-start" onSubmit={handleSubmit}>
        <div className="col-md-3 d-flex flex-column">
          <label className="form-label">Location *</label>
          <input
            type="text"
            className={`form-control ${flashLocation ? "flash-red-outline" : ""} ${locationInvalid ? "is-invalid" : ""}`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="invalid-feedback">
            Location is required.
          </div>
        </div>

        <div className="col-md-3 d-flex flex-column">
          <label className="form-label">Property Type</label>
          <select
            className="form-select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type || "Any"}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 d-flex flex-column">
          <label className="form-label">Bedrooms</label>
          <select
            className="form-select"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
            {bedroomOptions.map((value) => (
              <option key={value} value={value}>
                {value === "" ? "Any" : value}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 d-flex flex-column">
          <label className="mb-2" style={{ visibility: "hidden" }}>placeholder</label>
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      <h3>
        {hasSearched
          ? `${listings.length} Listing${listings.length === 1 ? '' : 's'} that match${listings.length === 1 ? 'es' : ''} your preferences`
          : 'Listings'}
      </h3>
      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <List
          height={700}
          itemCount={listings.length}
          itemSize={280}
          width="100%"
        >
          {({ index, style }) => {
            const listing = listings[index];
            return (
              <div style={{ ...style}}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{listing.name}</h5>
                    <p className="card-text two-line-clamp">
                      {listing.summary || "No summary available."}
                    </p>
                    <p><strong>Price:</strong> ${listing.price}</p>
                    <p><strong>Rating:</strong> {listing.review_scores?.review_scores_rating || "N/A"}</p>
                  </div>
                </div>
              </div>
            );
          }}
        </List>
      )}
    </div>
  );
}