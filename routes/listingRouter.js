const express = require('express');
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, validateReview } = require("../middleware.js");

//require controller for routing
const listingController = require("../controllers/listing.js");

//routes -- instead of app now we use router


//INdex route
router.get("/", wrapAsync(listingController.index)); // bcoz of controller we just use route here not write whole callbacks

//New Route
router.get("/new", isLoggedIn, listingController.renderNewRoute);

//Show Route
router.get("/:id", listingController.showListing);

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.postListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editListingGet);

//Update Route
router.put("/:id", isLoggedIn, isOwner, listingController.editPutReq);

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router; // exporting router 