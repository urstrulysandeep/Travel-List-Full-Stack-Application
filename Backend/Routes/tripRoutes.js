const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../Middleware/authMiddleware");
const Trip = require("../Models/Trip");
const router = express.Router();

function validateTrip(body) {
  const { tripName, Destination, StartDate, EndDate, Budget } = body || {};
  if (!tripName?.trim() || !Destination?.trim() || !StartDate?.trim() || !EndDate?.trim()) {
    return "Trip name, destination and dates are required";
  }
  if (!Number.isFinite(Number(Budget)) || Number(Budget) < 0) return "Budget must be a valid non-negative number";
  return null;
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const validationError = validateTrip(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const trip = await Trip.create({
      tripName: req.body.tripName.trim(),
      Destination: req.body.Destination.trim(),
      StartDate: req.body.StartDate.trim(),
      EndDate: req.body.EndDate.trim(),
      Budget: Number(req.body.Budget),
      user: req.user._id,
    });
    return res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error.message);
    return res.status(500).json({ message: "Could not create trip" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ _id: -1 });
    return res.status(200).json(trips);
  } catch (error) {
    console.error("Fetch trips error:", error.message);
    return res.status(500).json({ message: "Could not fetch trips" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid trip ID" });
    const validationError = validateTrip(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        tripName: req.body.tripName.trim(),
        Destination: req.body.Destination.trim(),
        StartDate: req.body.StartDate.trim(),
        EndDate: req.body.EndDate.trim(),
        Budget: Number(req.body.Budget),
      },
      { new: true, runValidators: true }
    );
    if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });
    return res.json(updatedTrip);
  } catch (error) {
    console.error("Update trip error:", error.message);
    return res.status(500).json({ message: "Could not update trip" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid trip ID" });
    const deletedTrip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedTrip) return res.status(404).json({ message: "Trip not found" });
    return res.json({ message: "Trip deleted" });
  } catch (error) {
    console.error("Delete trip error:", error.message);
    return res.status(500).json({ message: "Could not delete trip" });
  }
});

module.exports = router;
