const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");
const { post } = require("../routers/indexRouter");
const postModel = require("./Post");

// Comment Schema
const commentSchema = mongoose.Schema({
    commentAuthor: String,
    commentBody: String,
});

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
    comments: [commentSchema],
    posts: [postModel.schema],
});

userSchema.plugin(passportLocalmongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;