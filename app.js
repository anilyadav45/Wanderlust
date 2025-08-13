const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.engine('ejs', engine);
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


//validateReview middleware  for server side form validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

app.use("/listings", listings);
//review post route within listing 
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);//since each listing have array of reviews so we ca push new review to listing
  await newReview.save(); // save the new review to the database
  await listing.save();
  console.log(newReview);
  res.redirect(`/listings/${id}`);;
}));

//review delete route within listing
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Listing.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
