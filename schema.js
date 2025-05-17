// schemas.js
const Joi = require("joi");

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

module.exports = listingSchema;
