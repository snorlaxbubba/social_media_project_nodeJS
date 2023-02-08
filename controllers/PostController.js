// Table of Contents - PostController

// Variables......10
// Create.........24
// Read...........91

//Global Variables 
//---------------------------------------------------------------
const Post = require("../models/Post");
const passport = require("passport");
const RequestService = require("../services/RequestService");

// import and instantiate our userOps object
const PostOps = require("../data/PostOps");
const { profile } = require("console");
const _postOps = new PostOps();

const path = require("path");
const dataPath = path.join(__dirname, "../public/");

// Create
//---------------------------------------------------------------
//Create GET request
exports.Create = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        res.render("post/create", {
            errorMessage: "", 
            post: {}, 
            reqInfo: reqInfo 
        });
    } else {
        res.redirect(
            "/user/login?errorMessage=You must be logged in to view this page."
        );
    }
}

//Create POST request
exports.CreatePost = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        //If the user uploads an image
        let path = "";
        if (req.files != null ) {
            path = dataPath + "/images/posts/" + req.files.photo.name
            req.files.photo.mv(path)
            path = "/images/posts/" + req.files.photo.name
        }
        else {
            path = null;
        }

        //grabs the data from the form
        const newPost = new Post.model({
            title: req.body.title,
            picturePostPath: path,
            postBody: req.body.postBody,
            postLikes: 0,
            postComments: 0,
            tags: req.body.tags.split(","),

        });

        //creates the post using the data
        Post.model.create(
            new Post.model(newPost),
            function(err) {
                if(err) {
                    let reqInfo = RequestService.reqHelper(req);
                    return res.render("post/create", {
                        post: newPost,
                        errorMessage: err,
                        reqInfo: reqInfo,
                    });
                }
            }
        )
        //if the post is created successfully it will redirect to the user's homepage
        res.redirect("/post/home")
    } else {
        //if the user isn't authenticated, the user will be sent to the login page
        res.redirect(
            "/user/login?errorMessage=You must be logged in to view this page."
        );
    }
};

// Read
//---------------------------------------------------------------
//Directs to the user Home page
exports.Home = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    if (reqInfo.authenticated) {
       let posts = await _postOps.getAllPosts();
        //if there are any posts, send them to the post-home page, if not, then posts are null
        if (posts) {
            res.render("post/post-home", {
                posts: posts,
                errorMessage: errorMessage,
                reqInfo: reqInfo,
            });
        } else {
            posts = null;
        }
    } else {
        //if the user can't be authenticated, sends the user back to the login page
        res.redirect(
            "/user/login?errorMessage=You must be logged in to view this page."
        );
    }
}