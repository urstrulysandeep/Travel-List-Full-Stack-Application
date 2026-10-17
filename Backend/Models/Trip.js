const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  tripName: { type: String, required: true, trim: true },
  Destination: { type: String, required: true, trim: true },
  StartDate: { type: String, required: true },
  EndDate: { type: String, required: true },
  Budget: { type: Number, required: true, min: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
