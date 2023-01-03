const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        index: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    interests: {
        type: Array,
    },
    picturePath: {
        type: String,
    },
    roles: {
        type: Array,
    },
});

userSchema.plugin(passportLocalmongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;