const Post = require("../models/Post");
const passport = require("passport");
const RequestService = require("../services/RequestService");

// import and instantiate our userOps object
const PostOps = require("../data/PostOps");
const { profile } = require("console");
const _postOps = new PostOps();

const path = require("path");
const dataPath = path.join(__dirname, "../public/");

// Create
exports.Create = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
    res.render("post/create", {
        errorMessage: "", 
        post: {}, 
        reqInfo: reqInfo 
    });
} else {
    res.redirect(
        "/user/login?errorMessage=You must be logged in to view this page."
      );
}
}


exports.CreatePost = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {

        let path = "";
        if (req.files != null ) {
            path = dataPath + "/images/posts/" + req.files.photo.name
            req.files.photo.mv(path)
            path = "/images/posts/" + req.files.photo.name
        }
        else {
            path = null;
        }

        const newPost = new Post.model({
            picturePostPath: path,
            postBody: req.body.postBody,
            postLikes: 0,
            postComments: 0,
            tags: req.body.tags.split(","),

        });

        Post.model.create(
            new Post.model(newPost),
            function(err) {
                if(err) {
                    let reqInfo = RequestService.reqHelper(req);
                    return res.render("post/create", {
                        post: newPost,
                        errorMessage: err,
                        reqInfo: reqInfo,
                    });
                }
            }
        )
        res.redirect("/post/home")

    } else {
        res.redirect(
            "/user/login?errorMessage=You must be logged in to view this page."
          );
        }
};

//Directs to the user Home page
exports.Home = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    if (reqInfo.authenticated) {
       let posts = await _postOps.getAllPosts();

        if (posts) {
            res.render("post/post-home", {
                posts: posts,
                errorMessage: errorMessage,
                reqInfo: reqInfo,
            });
        } else {
            posts = null;
        }

} else {
    res.redirect(
        "/user/login?errorMessage=You must be logged in to view this page."
      );
}
}
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
  //
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
