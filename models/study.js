const mongoose = require('mongoose');
const Schema = mongoose.Schema;




// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const opts = { toJSON: { virtuals: true } };

const StudySession = new Schema({
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    course: String,
    time: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    joined: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        }
    ]
}, opts);


StudySession.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/studySession/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


module.exports = mongoose.model('StudySession', StudySession);