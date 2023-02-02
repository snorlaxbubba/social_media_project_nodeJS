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

userRouter.get("/home", UserController.Home);

userRouter.get("/profile", UserController.Profile);

userRouter.get("/profiles", UserController.Profiles);

userRouter.get("/user-profile/:username", UserController.Detail);

userRouter.get("/manager-area", UserController.ManagerArea);

userRouter.get("/admin-area", UserController.AdminArea);

userRouter.post("/comment/:username", UserController.Comments);

userRouter.get("/:username/delete", UserController.DeleteUserById);

module.exports = userRouter;