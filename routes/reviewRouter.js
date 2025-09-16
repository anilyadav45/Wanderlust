const express = require('express');
const router = express.Router({ mergeParams: true });// mergeParams allows us to access params from parent route
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


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


//routes for reviews 
//review post route within listing 
router.post("/", validateReview, wrapAsync(async (req, res) => { // we cut the common part of the route like /listings/:id/reviews/thenmore
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    console.log(newReview);
    listing.reviews.push(newReview);//since each listing have array of reviews so we ca push new review to listing
    await newReview.save(); // save the new review to the database
    await listing.save();
    console.log(newReview);
    req.flash("success", "Succesfully review added");

    res.redirect(`/listings/${id}`);;
}));

//review delete route within listing
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Listing.findByIdAndDelete(reviewId);
    req.flash("deleted", "Succesfully deleted a review");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;