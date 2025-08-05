const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: 'no-image.png',
    },
    url: {
      type: String,
      required: true,
      default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
    }
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  location: String,
  country: String,
  // each listing can have multiple reviews i.e one to many relationship from listing to reviews model
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
