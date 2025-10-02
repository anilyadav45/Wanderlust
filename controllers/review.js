const Review = require("../models/review");
const Listing = require('../models/listing');
//review post route
module.exports.reviewPost = async (req, res) => { // we cut the common part of the route like /listings/:id/reviews/thenmore
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; // jo user loggedin rehega wahi reviewAuthor hoga
    console.log(newReview);
    listing.reviews.push(newReview);//since each listing have array of reviews so we ca push new review to listing
    await newReview.save(); // save the new review to the database
    await listing.save();
    console.log(newReview);
    req.flash("success", "Succesfully review added");

    res.redirect(`/listings/${id}`)
}

//review destroy route
module.exports.reviewDestroy = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Listing.findByIdAndDelete(reviewId);
    req.flash("deleted", "Succesfully deleted a review");
    res.redirect(`/listings/${id}`)
}