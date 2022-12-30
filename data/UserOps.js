const User = require("../models/User");

class UserOps {
    UserOps() {}
    
    // async getAllUsers() {
    //     let users = await User.find().sort({ name: 1});
    //     return users;
    // }

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




    // async updateUserByEmail(id, name) {
    //     const user = await User.findById(id);

    //     user.name = name;
    //     let result = await user.save();

    //     return {
    //         obj: result,
    //         errorMsg: "",
    //     };
    // }
}

module.exports = UserOps;