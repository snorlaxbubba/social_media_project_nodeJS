// Table of Contents - UserController

// Variables......10
// Create.........24
// Read...........136
// Update.........195
// Delete.........263
// Comments.......294

//Global Variables 
//---------------------------------------------------------------
const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");

// import and instantiate our userOps object
const UserOps = require("../data/UserOps");
const { profile } = require("console");
const _userOps = new UserOps();

const path = require("path");
const dataPath = path.join(__dirname, "../public/");

// Create
//---------------------------------------------------------------
// Register Get Request
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {
        errorMessage: "", 
        user: {}, 
        reqInfo: reqInfo 
    });
}

//Register Post Request
exports.RegisterUser = async function (req, res) {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        let path = "";
        if (req.files != null ) {
            path = dataPath + "/images/" + req.files.photo.name
            req.files.photo.mv(path)
            path = "/images/" + req.files.photo.name
        } else {
            path = null;
        }

        //grabs the data from the form
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            interests: req.body.interests.split(","),
            picturePath: path
        });

        //registers the user
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
                //activates passport
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/user/profile");
                });
            }
        );
    } else {
        //error in the creation
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

//Login GET request
exports.Login = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("user/login", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
};

//Login POST request && authentication
exports.LoginUser = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/user/profile",
        failureRedirect: "/user/login?errorMessage=Invalid login.",
    })(req, res, next);
};

//Logout request, states the user logged out
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

// Read
//---------------------------------------------------------------

//Individual profile page 
exports.Profile = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if (reqInfo.authenticated) {
        //Grabbing roles of the user
        let roles = await _userOps.getRolesByUsername(reqInfo.username);
        let sessionData = req.session;
        // adding the role to the sessionData
        sessionData.roles = roles;
        reqInfo.roles = roles;
        //grabs userInfo by the username
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        let profileInfo = null;

        if(req.params.username){
            profileInfo = await _userOps.getUserByUsername(req.params.username)
        } else{
            profileInfo = userInfo
        }
        profiles = await _userOps.getAllUsers();
        //if the user is authenticated, return the information gathered to the individual profile
        return res.render("user/profile", {
            reqInfo: reqInfo,
            userInfo: userInfo,
            profileInfo: profileInfo,
            profiles: profiles,
        });
    } else {
        //redircts to the login page with an error
        res.redirect(
            "/user/login?errorMessage=You cannot view this page"
        );
    }
};

//List of all profiles
exports.Profiles = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    //if the user is authenticated
    if (reqInfo.authenticated) {
        let profiles = await _userOps.getAllUsers();
        //send the information to the profiles page
        return res.render("user/profiles", {
            reqInfo: reqInfo,
            profiles: profiles,
            errorMessage: ""
        })
    } else {
        //if the user can't be authenticated, the user will be sent back to the login page with an error
        res.redirect(
            "/user/login?errorMessage=You must be logged in to view this page."
        );
    }
};

// Update
//---------------------------------------------------------------
// Get request for the edit page
exports.Edit = async function (req, res) {
    const username = req.params.username;
    const profileId = req.params.id;
    //grabs the info if the user is an admin or manager
    let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
    //grabs the info for the overall user
    let {user} = await _userOps.getUserByUsername(username);
    //if it's a admin/manager or if the username matches 
    if( reqInfo.rolePermitted || reqInfo.username == username ) {
        res.render("user/profile-edit", {
            errorMessage: "",
            profile_id: profileId,
            reqInfo: reqInfo,
            user: user,
        });
    } else {
        //if the user can't be authenticated, the user will be sent back to the login page with an error
        res.redirect(
            "/user/login?errorMessage=You must be a manager or admin to access this area."
        );
    }
}

// POST EDIT
exports.EditProfile = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    //grabs the info from the form
    const userFirstName = req.body.firstName;
    const userLastName = req.body.lastName;
    const userEmail = req.body.email;
    const userRoles = req.body.roles;
    const deleteProfilePic = req.body.deleteProfilePic;
    let path = "";
    let profileInterests = req.body.interests.split(",");
    let username = req.body.username;
    // Updating the image IF there is an already existing image
    if(req.files != null) {
        path = dataPath+"/images/"+req.files.photo.name
        req.files.photo.mv(path) 
        path = "/images/"+req.files.photo.name
    } else{
        path = null;
    }
    // Updates the user based on all the information from the form
    let responseObj = await _userOps.updateUserByUsername(username, userFirstName, userLastName, userEmail, profileInterests, userRoles, path, deleteProfilePic);
    profileInfo = await _userOps.getUserByUsername(req.params.username)
    profiles = await _userOps.getAllUsers();
    // If there is no error, the user gets updated and sent back to their profile
    if (responseObj.errorMsg == "") {
        res.render("user/profile", {
            reqInfo: reqInfo,
            profileInfo: profileInfo,
            profiles: profiles,
            // layout: "./layouts/side-bar-layout"
        });
    } else {
        //If there is an error, the user is sent back to the edit page with an error message
        res.render("profile-edit", {
            profile: responseObj.obj,
            profiles: profiles,
            errorMessage: responseObj.errorMsg,
        });
    }
};

// Delete
//---------------------------------------------------------------
exports.DeleteUserById = async function (req, res) {
    let username = req.params.username;
    //Grab roles by username
    const userProfile = await _userOps.getRolesByUsername(username);
    const profileId = userProfile.user._id;

    let reqInfo = RequestService.reqHelper(req, ["Admin"]);
    //If the user is an Admin, the Admin will have access to delete Users
    if(reqInfo.rolePermitted) {
        let deleteUser = await _userOps.deleteUserById(profileId);
        let users = await _userOps.getAllUsers();
        //If the user gets deleted, the admin gets sent back to the profiles page
        if (deleteUser) {
            return res.render("user/profiles", {
                users: users,
                reqInfo: reqInfo,
                errorMessage: ""
            });
        //If there is an error, the Profiles page will have an error message on it.
        } else {
            res.render("user/profiles", {
                profiles: users,
                reqInfo: reqInfo,
                errorMessage: "Profile Not Deleted"
            });
        };
    }
};

// Comments
//---------------------------------------------------------------
exports.Comments = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    //Grabs comments from the form data
    const comment = {
        commentBody: req.body.comment,
        commentAuthor: reqInfo.username,
    };
    //adds comment to the database
    let profileInfo = await _userOps.addCommentToUser(
        comment,
        req.params.username
    );
    //if there it's successful, the page will refresh
    if (profileInfo.errorMessage = "") {
        return res.render("user/profile", {
            reqInfo: reqInfo,
            profileInfo: profileInfo,
        });
    } else {
        //if there it's successful, the page will refresh with an error
        res.render("user/profile", {
            reqInfo: reqInfo,
            profileInfo: profileInfo,
            errorMessage: "Comment Not Created"
        });
    }
}
