const express = require('express');
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, validateReview } = require("../middleware.js");
const { upload } = require("../multer.middleware.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

//require controller for routing
const listingController = require("../controllers/listing.js");

//keeping common routes in one --> router.route so to debug it will be easy and also we don't have to write path again and again
// -  "/"
router.route("/")
    .get(wrapAsync(listingController.index))
    // .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.postListing));
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.postListing));



//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewRoute));
//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingGet));

//for  -  /:id commons path
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, wrapAsync(listingController.editPutReq))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router; // exporting router 