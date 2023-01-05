const User = require("../models/User");

class UserOps {
  UserOps() {}
    
  async getAllUsers() {
    let users = await User.find().sort({ lastName: 1});
    return users;
  }

  async getUserById(id) {
    let userProfile = await User.findById(id);
    return userProfile;
  }

  async getUserByEmail(email) {
    let user = await User.findOne({ email: email });
    if (user) {
      const response = { obj: user, errorMessage: ""};
      return response;
    } else {
      return null;
    }
  }

  async getUserByUsername(username) {
    let user = await User.findOne(
      { username: username },
      { _id: 0, username: 1, email: 1, firstName: 1, lastName: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }


  async getRolesByUsername(username) {
    let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
    if (user.roles) {
      return user.roles;
    } else {
      return [];
    }
  }

  async updateUserByUsername(username, profileFirstName, profileLastName, profileEmail, profileInterests, profileRoles, deleteProfilePic, picturePath) {
    const user = await User.findByUsername(username);

    user.firstName = profileFirstName;
    user.lastName = profileLastName;
    user.email = profileEmail;
    user.interests = profileInterests;
    user.roles = profileRoles;

    if(picturePath){
      user.picturePath = picturePath;
    }

    if(deleteProfilePic){
      user.picturePath = null;
    }

    let result = await user.save();

    return {
      obj: result,
      errorMsg: "",
    };
  }

  async deleteUserById(id) {
    let result = await User.findByIdAndDelete(id);

    return result;
  }

  async addCommentToUser(comment, username) {
    let user = await User.findOne({ username: username });
    user.comments.push(comment);
    try {
      let result = await user.save();
      console.log("updated user: ", result);
      const response = { user: result, errorMessage: "" };
      return response;
    } catch (error) {
      console.log("error saving user: ", result);
      const response = { user: user, errorMessage: error };
      return response;
    }
  }
}

module.exports = UserOps;