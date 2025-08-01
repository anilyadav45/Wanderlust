const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String

  },
  price: Number,
  location: String,
  country: String,
  // each listing can have multiple reviews i.e one to many relationship from listing to reviews model
  reviews : [{
    type : Schema.Types.ObjectId,
    ref : "Review"
  }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
