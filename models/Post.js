const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

const postCommentSchema = mongoose.Schema({
    postCommentAuthor: String,
    postCommentBody: String
})

const postSchema = mongoose.Schema({
    picturePostPath: {
        type: String,
    },
    postBody: {
        type: String,
    },
    postLikes: {
        type: Number,
    },
    postComments: {
        type: Number,
    },
    tags: {
        type: Array,
    },
    postComment: [postCommentSchema]
})

postSchema.plugin(passportLocalmongoose);

module.exports = {
    model: mongoose.model("Post", postSchema),
    schema: postSchema
};
