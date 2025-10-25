
//Controllers/listings
const Listing = require("../models/listing");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

//listing index route
module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        res.redirect("/error");
    }
}
//new route
module.exports.renderNewRoute = (req, res) => {
    res.render("listings/new.ejs");
};


//get indivisual post - show route
module.exports.showListing = async (req, res) => {
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
    if (listing.owner) {
        console.log(listing.owner.username);
    } else {
        console.log(" This listing has no owner info yet");
    }

    res.render("listings/show.ejs", { listing });
};

//post listing 
module.exports.postListing = async (req, res, next) => {
    try {
        // 1️ Upload the file from multer temp folder to Cloudinary
        const cloudUrl = await uploadOnCloudinary(req.file.path);

        // 2️ Create a new listing using form data + Cloudinary URL
        const newListing = new Listing(req.body.listing);

        if (cloudUrl) {
            newListing.image = {
                url: cloudUrl,
                filename: req.file.filename
            };
        } else {
            // fallback image if upload fails
            newListing.image = {
                url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                filename: "default"
            };
        }


        newListing.owner = req.user._id;

        //saave to mongodb
        await newListing.save();

        console.log(" Saved listing with Cloudinary image:", newListing);
        req.flash("success", "Successfully created a new listing!");
        res.redirect(`/listings/${newListing._id}`);

    } catch (err) {
        console.error("Error creating listing:", err);
        next(err);
    }
};

//edit listing - get form and passing listing and reduced url
module.exports.editListingGet = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");//reducing img size no need to render full kwality on edit route
    res.render("listings/edit.ejs", { listing ,originalUrl});
};

//edit listing post - put req -actual edit handler
module.exports.editPutReq = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
   
    console.log("old listing:", listing);
    console.log("req.file:",req.file);
  

    // check if file exists (when user uploads new image)
    if (typeof req.file !== 'undefined') {
        // upload new image to cloudinary
        const result = await uploadOnCloudinary(req.file.path);

        if (result) {
            console.log("result is : ",result);
            listing.image = {
                url: result,
                filename: req.file.filename
            };
            await listing.save();
        }
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};
//delete or destroy  listing route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        req.flash("error", "Cannot Find that Listing");
        return res.redirect("/listings");
    }
    req.flash("deleted", "Succesfully deleted a listing");
    res.redirect("/listings");
};