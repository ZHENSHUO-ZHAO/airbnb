import express from "express";
import {
  bookingCollection,
  listingCollection,
  clientCollection,
} from "../const.js";
import { ObjectId, Decimal128 } from "mongodb";
import { convertDecimalObjects } from "../utils.js";

const router = express.Router();

router.post("/makeBooking", async (req, res) => {
  const client = req.mongoClient;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const db = req.db;
      const {
        startDate,
        endDate,
        listingID,
        name,
        emailAddress,
        mobileNumber,
        postalAddress,
        homeAddress,
      } = req.body;

      if (
        !startDate ||
        !endDate ||
        !name ||
        !emailAddress ||
        !mobileNumber ||
        !listingID
      ) {
        await session.abortTransaction();
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Validate that endDate is at least one day after startDate
      const checkInDate = new Date(startDate);
      const checkOutDate = new Date(endDate);
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (checkOutDate.getTime() - checkInDate.getTime() < oneDayMs) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ error: "Check Out date must be after Check In date." });
      }

      // Check for overlapping bookings
      const overlapping = await db.collection(bookingCollection).findOne(
        {
          "listingDetails.listingID": listingID,
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
        { session }
      );

      if (overlapping) {
        await session.abortTransaction();
        return res
          .status(409)
          .json({
            error: "Selected dates are already booked for this listing.",
          });
      }

      const balanceDueDate = new Date(
        new Date(startDate).getTime() - 1 * 24 * 60 * 60 * 1000
      );
      const depositPaid = Decimal128.fromString("0");
      const numGuests = 0;
      const guestList = [];

      const clientResult = await db.collection(clientCollection).insertOne(
        {
          name,
          emailAddress,
          daytimePhoneNumber: mobileNumber,
          mobileNumber,
          postalAddress: postalAddress || "",
          homeAddress: homeAddress || "",
        },
        { session }
      );

      const clientID = clientResult.insertedId;

      const listing = await db
        .collection(listingCollection)
        .findOne({ _id: listingID });

      if (!listing) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Listing not found." });
      }

      const nights =
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
      const extraPeopleFee = listing.extra_people
        ? parseFloat(listing.extra_people) * numGuests
        : 0;
      const price = listing.price ? parseFloat(listing.price) : 0;
      const cleaning = listing.cleaning_fee
        ? parseFloat(listing.cleaning_fee)
        : 0;
      const security = listing.security_deposit
        ? parseFloat(listing.security_deposit)
        : 0;

      const baseCost = (price + extraPeopleFee) * nights;
      const balanceAmountDue = Decimal128.fromString(
        (baseCost + cleaning + security).toFixed(2)
      );

      const booking = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        bookingDate: new Date(),
        depositPaid,
        balanceAmountDue,
        balanceDueDate: new Date(balanceDueDate),
        numGuests,
        guestList,
        clientDetails: {
          clientID,
          fullName: name,
        },
        listingDetails: {
          listingID: listing._id,
          name: listing.name,
          property_type: listing.property_type,
          room_type: listing.room_type,
          listing_url: listing.listing_url,
          price,
          ...(cleaning && { cleaning_fee: cleaning }),
          ...(security && { security_deposit: security }),
          address: {
            country: listing.address?.country || "",
            market: listing.address?.market || "",
            suburb: listing.address?.suburb || "",
          },
          host: {
            host_id: listing.host?.host_id || "",
            name: listing.host?.host_name || "",
          },
        },
      };

      const result = await db
        .collection(bookingCollection)
        .insertOne(booking, { session });
      res.status(201).json({ bookingId: result.insertedId });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.endSession();
  }
});

router.get("/myBookings", async (req, res) => {
  try {
    const db = req.db;
    const clientId = req.query.clientId;

    if (!clientId) {
      return res.status(400).json({ error: "clientId is required" });
    }

    const bookings = await db
      .collection(bookingCollection)
      .find({ "clientDetails.clientID": new ObjectId(clientId) })
      .toArray();

    res.json(bookings.map(convertDecimalObjects));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
