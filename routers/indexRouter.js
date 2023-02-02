const express = require("express");
const indexRouter = express.Router();
const indexController = require("../controllers/IndexController");

indexRouter.get("/", indexController.Index);

indexRouter.get("/about", indexController.About);

indexRouter.get("/accessibility", indexController.Accessibility);

indexRouter.get("/contact", indexController.Contact);

indexRouter.get("/faq", indexController.Faq);

indexRouter.get("/privacy-policy", indexController.Privacy);

indexRouter.get("/terms-of-service", indexController.Terms);

module.exports = indexRouter;