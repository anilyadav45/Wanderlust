const express = require('express');
const router = express.Router({ mergeParams: true });// mergeParams allows us to access params from parent route
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn} = require("../middleware.js");
//requiring controller for reviews
const reviewController = require("../controllers/review.js");


//routes for reviews 
//review post route within listing 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviewPost));

//review delete route within listing
router.delete("/:reviewId", wrapAsync(reviewController.reviewDestroy));

module.exports = router;