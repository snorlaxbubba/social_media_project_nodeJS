const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

// Comment Schema
const commentSchema = mongoose.Schema({
    commentAuthor: String,
    commentBody: String,
});

const postSchema = mongoose.Schema({
    picturePostPath: String,
    postBody: String,
    postLikes: Number,

    postCommentAuthor: String,
    postCommentBody: String

})

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
    post: [postSchema],
});

userSchema.plugin(passportLocalmongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;