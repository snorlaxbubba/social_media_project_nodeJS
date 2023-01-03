const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");

// import and instantiate our userOps object
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();

// Create
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {
        errorMessage: "", 
        user: {}, 
        reqInfo: reqInfo 
    });
}

exports.RegisterUser = async function (req, res) {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
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
                    res.redirect("/user/profile");
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
        successRedirect: "/user/profile",
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

// Read
exports.Profile = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
      const userId = req.params.id;
      let roles = await _userOps.getRolesByUsername(reqInfo.username);
      let sessionData = req.session;
      sessionData.roles = roles;
      reqInfo.roles = roles;
      let userInfo = await _userOps.getUserByUsername(reqInfo.username);
      return res.render("user/profile", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        userId: userId,
      });
    } else {
      res.redirect(
        "/user/login?errorMessage=You must be logged in to view this page."
      );
    }
};

exports.Profiles = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        let profiles = await _userOps.getAllUsers();

        return res.render("user/profiles", {
            reqInfo: reqInfo,
            profiles: profiles,
        })
    } else {

        res.redirect(
        "/user/login?errorMessage=You must be logged in to view this page."
      );
    }
};

exports.Detail = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        const userId = req.params.id;

        let userProfile = await _userOps.getUserById(userId);

        return res.render("user/user-profile", {
            reqInfo: reqInfo,
            userProfile: userProfile,
            userId: req.params.id,
        })
    } else {

        res.redirect(
        "/user/login?errorMessage=You must be logged in to view this page."
      );
    }

}

// Update

exports.Edit = async function (req, res) {
    const username = req.params.username;
    const profileId = req.params.id;
    let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);

    let {user} = await _userOps.getUserByUsername(username);

    if( reqInfo.rolePermitted || reqInfo.username == username ) {
        res.render("user/profile-edit", {
            errorMessage: "",
            profile_id: profileId,
            reqInfo: reqInfo,
            user: user,
        })
    } else {
        res.redirect(
            "/user/login?errorMessage=You must be a manager or admin to access this area."
        );
    }
}

// POST EDIT
exports.EditProfile = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
  
    const userFirstName = request.body.firstName;
    const userLastName = request.body.lastName;
    const userEmail = request.body.email;
    const userRoles = request.body.roles;
    let path = "";
    let profileInterests = request.body.interests.split(",");
    let username = request.body.username;
  
    const deleteProfilePic = request.body.deleteProfilePic;
  
  
    if(request.files != null)
    {
      path = dataPath+"/images/"+request.files.photo.name
      request.files.photo.mv(path) 
      path = "/images/"+request.files.photo.name
    }
    else{
      path = null;
    }
  
    let responseObj = await _userOps.updateUserByUserName(username, userFirstName, userLastName, userEmail, profileInterests, userRoles, path, deleteProfilePic);
  
    profiles = await _userOps.getAllProfiles();
  
    if (responseObj.errorMsg == "") {
      response.render("user/profile", {
        reqInfo: reqInfo,
        profileInfo: responseObj,
        profiles: profiles,
        layout: "./layouts/side-bar-layout"
      });
    }
  
    else {
      console.log("An error occured. Item not created.");
      response.render("profile-form", {
        profile: responseObj.obj,
        profiles: profiles,
        errorMessage: responseObj.errorMsg,
      });
    }
  };

// exports.Edit = async function (req, res) {
//     let reqInfo = RequestService.reqHelper(req);
//     if (reqInfo.authenticated) {
//         const userId = req.params.id;
//         let userProfile = await _userOps.getUserById(userId);
//         return res.render("user/register", {
//             errorMessage: "",
//             userId: userId,
//             user: userProfile,
//             reqInfo: reqInfo,
//         })
//     } else {
//         res.redirect(
//         "/user/login?errorMessage=You must be logged in to view this page."
//       );
//     }
// };

// exports.EditUser = async function (req, res) {
//     let reqInfo = RequestService.reqHelper(req);
//     if (reqInfo.authenticated) {
//         const userId = req.params.id;
//         const userFirstName = req.body.firstName;
//         const userLastName = req.body.lastName;
//         const userEmail = req.body.email;

//         let responseObj = await _userOps.updateUserById(userId, userFirstName, userLastName, userEmail)

//         if (responseObj.errorMsg == "") {
//             let profiles = await _userOps.getAllUsers();
//             res.render("user/profile", {
//                 user: profiles, 
//                 userId: responseObj.obj._id.valueOf(),
//                 reqInfo: reqInfo
//             });
//         } else {
//             res.render("user/register", {
//                 profile: responseObj.obj,
//                 userId: userId,
//                 errorMessage: responseObj.errorMsg,
//                 reqInfo: reqInfo,
//             });
//         }
//     } else {
//         res.redirect(
//         "/user/login?errorMessage=You must be logged in to view this page."
//       );
//     }
// }
exports.ManagerArea = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);

    if (reqInfo.rolePermitted) {
        res.render("user/manager-area", { errorMessage: "", reqInfo: reqInfo });
    } else {
        res.redirect(
            "/user/login?errorMessage=You must be a manager or admin to access this area."
        );
    }
};

exports.AdminArea = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req, ["Admin"]);

    if (reqInfo.rolePermitted) {
        res.render("user/admin-area", { errorMessage: "", reqInfo: reqInfo });
    } else {
        res.redirect(
            "/user/login?errorMessage=You must be an admin to access this area."
        );
    }
};

