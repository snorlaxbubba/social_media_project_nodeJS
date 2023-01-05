const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");



// Comment Schema
const commentSchema = mongoose.Schema({
    commentAuthor: String,
    commentBody: String,
});

const pictureInfoSchema = mongoose.Schema({
    pictureLikes: Number,
    pictureCommentsAuthor: String,
    pictureCommentsBody: String

})

const picturePostSchema = mongoose.Schema({
    pictureAuthor: String,
    picturePostPath: String,
    pictureInfo: [pictureInfoSchema],
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
    picturePost: [picturePostSchema],
});

userSchema.plugin(passportLocalmongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;