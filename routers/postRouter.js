const express = require("express");
const postRouter = express.Router();

const PostController = require("../controllers/PostController");
const Post = require("../models/Post");

const fs = require("fs").promises;
const path = require("path");
const dataPath = path.join(__dirname, "../data/");

postRouter.get("/create", PostController.Create);
postRouter.post("/create", PostController.CreatePost)

postRouter.get("/home", PostController.Home);

module.exports = postRouter;