const Post = require("../models/Post");

class PostOps {
    PostOps() {}
    
  async getAllPosts() {
    let posts = await (await Post.model.find()).reverse();
    console.log(posts)
    return posts;
  }

  async getPostById(id) {
    let individualPost = await Post.findById(id);
    return individualPost;
  }

//   async getUserByEmail(email) {
//     let post = await Post.findOne({ email: email });
//     if (post) {
//       const response = { obj: post, errorMessage: ""};
//       return response;
//     } else {
//       return null;
//     }
//   }

  // async getUserByUsername(username) {
  //   let post = await User.findOne(
  //     { username: username },
  //     { _id: 0, username: 1, email: 1, firstName: 1, lastName: 1 }
  //   );
  //   if (post) {
  //     const response = { post: post, errorMessage: "" };
  //     return response;
  //   } else {
  //     return null;
  //   }
  // }


//   async getRolesByUsername(username) {
//     let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
//     if (user.roles) {
//       return user.roles;
//     } else {
//       return [];
//     }
//   }

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

  async deletePostById(id) {
    let result = await Post.findByIdAndDelete(id);

    return result;
  }

//   async addCommentToUser(comment, username) {
//     let user = await User.findOne({ username: username });
//     user.comments.push(comment);
//     try {
//       let result = await user.save();
//       console.log("updated user: ", result);
//       const response = { user: result, errorMessage: "" };
//       return response;
//     } catch (error) {
//       console.log("error saving user: ", result);
//       const response = { user: user, errorMessage: error };
//       return response;
//     }
//   }
}

module.exports = PostOps;