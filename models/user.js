const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');



const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    program: {
        type: String
        // required: true 
    },
    semester: {
        type: String
        // required: true 
    },
    courses: [
        {
            title: {
                type: String,
                required: true
            }
        }
    ],
    sessionsAttended: {
        type: Number,
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);