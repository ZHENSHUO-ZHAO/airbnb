import express from "express";
import { listingCollection } from "../const.js";

const router = express.Router();
const projection = {
  name: 1,
  summary: 1,
  price: 1,
  "review_scores.review_scores_rating": 1,
};

router.get("/randomListing", async (req, res) => {
  try {
    const listings = await req.db
      .collection(listingCollection)
      .aggregate([{ $sample: { size: 5 } }, { $project: projection }])
      .toArray();

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/searchListing", async (req, res) => {
  try {
    const { market, property_type, bedrooms } = req.query;

    if (!market) {
      return res.status(400).json({ error: "Missing required field: market" });
    }

    const query = {
      "address.market": market,
    };

    if (property_type) {
      query.property_type = property_type;
    }

    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }

    const listings = await req.db
      .collection(listingCollection)
      .find(query, { projection })
      .toArray();

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
