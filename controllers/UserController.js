const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");
const path = require("path");
const dataPath = path.join(__dirname, "../public/");

// import and instantiate our userOps object
const UserOps = require("../data/UserOps");
const { profile } = require("console");
const _userOps = new UserOps();

// Create
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {
        errorMessage: "", 
        user: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            interests: [],
            picturePath: "",
        }, 
        reqInfo: reqInfo 
    });
}

exports.RegisterUser = async function (req, res) {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {
            let path = "";
        if(req.files != null)
        {
        path = dataPath+"/images/"+req.files.picture.name
        req.files.picture.mv(path) 
        path = "/images/"+req.files.picture.name
        }
        else{
        path = null;
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            interests: req.body.interests.split(", "),
            picturePath: path
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
                interests: req.body.interests.split(", "),
                picturePath: path
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
      let userInfo = await _userOps.getUserByUsername(reqInfo.username);
      let sessionData = req.session;
      sessionData.roles = roles;
      reqInfo.roles = roles;
      let picturePath = userInfo.picturePath
      return res.render("user/profile", {
        reqInfo: reqInfo,
        userInfo: userInfo,
        userId: userId,
        picturePath: picturePath,
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
            errorMessage: ""
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
  
    let responseObj = await _userOps.updateUserByUsername(username, userFirstName, userLastName, userEmail, profileInterests, userRoles, path, deleteProfilePic);

    profiles = await _userOps.getAllUsers();
  
    if (responseObj.errorMsg == "") {
      response.render("user/user-profile", {
        reqInfo: reqInfo,
        userProfile: responseObj,
        profiles: profiles,
        // layout: "./layouts/side-bar-layout"
      });
    }
  
    else {
      console.log("An error occured. Item not created.");
      response.render("profile-edit", {
        profile: responseObj.obj,
        profiles: profiles,
        errorMessage: responseObj.errorMsg,
      });
    }
};

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

exports.DeleteUserById = async function (req, res) {
    let username = req.params.username;

    const userProfile = await _userOps.getRolesByUsername(username);
    const profileId = userProfile.user._id;

    let reqInfo = RequestService.reqHelper(req, ["Admin"]);

    if(reqInfo.rolePermitted) {
        let deleteUser = await _userOps.deleteUserById(profileId);
        let users = await _userOps.getAllUsers();
        if (deleteUser) {
            return res.render("user/profiles", {
                users: users,
                reqInfo: reqInfo,
                errorMessage: ""
            });
        }
            else {
                res.render("user/profiles", {
                    profiles: users,
                    reqInfo: reqInfo,
                    errorMessage: "Profile Not Deleted"
                });

        };
    }
};

exports.Comments = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    const comment = {
      commentBody: req.body.comment,
      commentAuthor: reqInfo.username,
    };

    let profileInfo = await _userOps.addCommentToUser(
      comment,
      req.params.username
    );

    if (profileInfo.errorMessage = "") {
        return res.render("user/user-profile", {
            reqInfo: reqInfo,
            userInfo: profileInfo,
        });
    } else {
        console.log("An error occured. Item not created.");
        res.render("user/profile", {
          reqInfo: reqInfo,
          userInfo: profileInfo,
        });
    }


}
