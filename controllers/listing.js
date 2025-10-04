
//Controllers/listings
const Listing = require("../models/listing");
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
    console.log(listing.owner.username);//here you can see in details what populate do so we can access in ejs for each listing owner
    res.render("listings/show.ejs", { listing });
};

//post listing 
module.exports.postListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        if (!newListing.image.url) {
            newListing.image.url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
        }
        newListing.owner = req.user._id; // associating listing with user who created it -- for new listing owner is current user so we assing user id to owner
        await newListing.save();
        req.flash("success", "Succesfully made a new listing"); // after save new listing it display flash one time
        console.log(newListing);
        res.redirect("/listings");
    } catch (err) {
        next(err); // Passes the error to the error handling middleware
    }
};

//edit listing - get form
module.exports.editListingGet = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

//edit listing post - put req 
module.exports.editPutReq = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully");
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