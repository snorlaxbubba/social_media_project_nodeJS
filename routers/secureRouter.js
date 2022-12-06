const express = require("express");
const secureRouter = express.Router();

const SecureController = require("../controllers/SecureController");

secureRouter.get("/secure-area", SecureController.Index);

secureRouter.post("/set-colour", SecureController.SetColour);

secureRouter.get("/hello", SecureController.hello);
secureRouter.post("/hello", SecureController.hello);

module.exports = secureRouter;