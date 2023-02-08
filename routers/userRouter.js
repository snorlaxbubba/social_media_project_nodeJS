const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");
const User = require("../models/User");

const fs = require("fs").promises;
const path = require("path");
const dataPath = path.join(__dirname, "../data/");



userRouter.get("/login", UserController.Login);
userRouter.post("/login", UserController.LoginUser);

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/edit/:username", UserController.Edit);
userRouter.post("/edit/:username", UserController.EditProfile);

userRouter.get("/logout", UserController.Logout);

userRouter.get("/profile", UserController.Profile);
userRouter.get("/profile/:username", UserController.Profile);

userRouter.get("/profiles", UserController.Profiles);

userRouter.post("/comment/:username", UserController.Comments);

userRouter.get("/:username/delete", UserController.DeleteUserById);

module.exports = userRouter;