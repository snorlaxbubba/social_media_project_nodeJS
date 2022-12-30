const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");
const User = require("../models/User");

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/login", UserController.Login);
userRouter.post("/login", UserController.LoginUser);

userRouter.get("/logout", UserController.Logout);

userRouter.get("/profile", UserController.Profile);

userRouter.get("/manager-area", UserController.ManagerArea);

userRouter.get("/admin-area", UserController.AdminArea);

module.exports = userRouter;