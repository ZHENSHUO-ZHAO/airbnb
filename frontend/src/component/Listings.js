// src/component/Listings.js
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

export default function Listings({ listings, hasSearched }) {
  return (
    <div>
      <h3>
        {hasSearched
          ? `${listings.length} Listing${
              listings.length === 1 ? "" : "s"
            } that match${listings.length === 1 ? "es" : ""} your preferences`
          : `${listings.length} Recommended Listing${
              listings.length === 1 ? "" : "s"
            }`}
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
              <div style={{ ...style }}>
                <div
                  className="card m-2 shadow-md"
                  style={{
                    border: "2px solid rgba(0, 152, 198, 0.32)",
                    boxShadow: "inset 0 0 8px 3px rgba(0, 195, 255, 0.37)",
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link
                        to={`/booking/${listing._id}`}
                        className="text-decoration-none text-primary"
                      >
                        {listing.name}
                      </Link>
                    </h5>
                    <p className="card-text two-line-clamp">
                      {listing.summary || "No summary available."}
                    </p>
                    <p>
                      <strong>Price:</strong> ${listing.price}
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      {listing.review_scores?.review_scores_rating || "N/A"}
                    </p>
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
