// schemas.js  -- this is for server side validation usnig joi
const Joi = require("joi");
//for listingschema validation
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().allow("").max(500),
        image: Joi.string().uri().allow(""),
        price: Joi.number().required().min(0),
        country: Joi.string().required().min(2),
        location: Joi.string().required().min(2),
    }).required(),
});

//for reviewschema validation
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1),
        comment: Joi.string().required().max(100),

    }).required(),
});

module.exports = {
    listingSchema,
    reviewSchema,
};
