const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");

exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {errorMessage: "", user: {}, reqInfo: reqInfo });
}

exports.RegisterUser = async function (req, res) {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {
        const newUser = newUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
        });

        User.register(
            new User(newUser),
            req.body.password,
            function (err, account) {
                if (err) {
                    let reqInfo = RequestService.reqHelper(req);
                    return res.render("user/register", {
                        user: newUser,
                        errorMessage: err,
                        reqInfo: reqInfo,
                    });
                }

                passport.authenticate("local")(req, res, function() {
                    res.redirect("/secure/secure-area");
                });
            }
        );
    } else {
        let reqInfo = RequestService.reqHelper(req);
        res.render("user/register", {
            user: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
            },
            errorMessage: "Passwords do not match.",
            reqInfo: reqInfo,
        });
    }
};

exports.Login = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("user/login", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
};

exports.LoginUser = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/secure/secure-area",
        failureRedirect: "/user/login?errorMessage=Invalid login.",
    })(req, res, next);
};

exports.Logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("logout error");
            return next(err);
        }else {
            let reqInfo = RequestService.reqHelper(req);

            res.render("user/login", {
                user: {}, 
                isLoggedIn: false,
                errorMessage: "",
                reqInfo: reqInfo,
            });
        }
    });
};