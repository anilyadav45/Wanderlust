const express = require('express');
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, validateReview } = require("../middleware.js");

//routes -- instead of app now we use router


//INdex route
router.get("/", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        res.redirect("/error");
    }
});
//test flash
router.get("/test-flash", async (req, res) => {
    await req.flash("success", "Success works!");
    await req.flash("deleted", "Deleted works!");
    await req.flash("error", "Error works!");
    res.redirect("/listings");
});

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author", // review ke sath author detail aajaye  we use in ejs
            }
        })
        .populate("owner");
    //populate nested will give details of objects
    console.log(listing.owner.username);//here you can see in details what populate do so we can access in ejs for each listing owner
    res.render("listings/show.ejs", { listing });
});

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // associating listing with user who created it -- for new listing owner is current user so we assing user id to owner
        await newListing.save();
        req.flash("success", "Succesfully made a new listing"); // after save new listing it display flash one time
        console.log(newListing);
        res.redirect("/listings");
    } catch (err) {
        next(err); // Passes the error to the error handling middleware
    }
}));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
});

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        req.flash("error", "Cannot Find that Listing");
        return res.redirect("/listings");
    }
    req.flash("deleted", "Succesfully deleted a listing");
    res.redirect("/listings");
});

module.exports = router; // exporting router 