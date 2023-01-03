const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");
const User = require("../models/User");



userRouter.get("/login", UserController.Login);
userRouter.post("/login", UserController.LoginUser);

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/edit/:username", UserController.Edit);
userRouter.post("/edit/:username", UserController.EditProfile);

userRouter.get("/logout", UserController.Logout);

userRouter.get("/profile", UserController.Profile);

userRouter.get("/profiles", UserController.Profiles);

userRouter.get("/user-profile/:id", UserController.Detail);

userRouter.get("/manager-area", UserController.ManagerArea);

userRouter.get("/admin-area", UserController.AdminArea);

module.exports = userRouter;