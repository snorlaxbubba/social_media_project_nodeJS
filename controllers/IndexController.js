const RequestService = require("../services/RequestService");

//User not logged in HomePage
exports.Index = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("index", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
}

//Directs to the About page
exports.About = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("about", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
}

//Directs to the Accessibility page
exports.Accessibility = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("accessibility", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
}

//Directs to the Contact page
exports.Contact = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("contact", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
}

//Directs to the FAQ page
exports.Faq = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("faq", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
};

//Directs to the Privacy Policy page
exports.Privacy = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("privacy-policy", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
}

//Directs to the Terms of Service page
exports.Terms = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("terms-of-service", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
}