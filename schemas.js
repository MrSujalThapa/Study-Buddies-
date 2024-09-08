const Joi = require('joi');

module.exports.sessionSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    time: Joi.string().required(),
    course: Joi.string().required(), // Adjust if course is an ObjectId or string
    description: Joi.string().required()
});