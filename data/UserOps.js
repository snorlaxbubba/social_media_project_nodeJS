// Table of Contents - UserOps

// Variables.............10
// getAllUsers...........21
// getUserById...........27
// getUserByEmail........33
// getUserByUsername.....45
// getRolesByUsername....67
// updateUserByUsername..77
// deleteUserById........110
// addCommentToUser......116

//Global Variables 
//---------------------------------------------------------------
const User = require("../models/User");

class UserOps {
  	UserOps() {}
    
	//Gets all users, sorted by Last Name
	async getAllUsers() {
		let users = await User.find().sort({ lastName: 1});
		return users;
	}

	//Gets users by Id
	async getUserById(id) {
		let userProfile = await User.findById(id);
		return userProfile;
	}

	//Gets users by Email
	async getUserByEmail(email) {
		let user = await User.findOne({ email: email });
		if (user) {
			const response = { obj: user, errorMessage: ""};
			return response;
		} else {
			return null;
		}
	}

	/*Gets users by username and passes the following data to the controller, to be used in the view: 
		id, username, email, first name, last name, interests, roles, profile picture, and if they have any comments*/
	async getUserByUsername(username) {
		let user = await User.findOne(
			{ username: username },
			{ _id: 1, 
			  username: 1, 
			  email: 1, 
			  firstName: 1, 
			  lastName: 1, 
			  interests: 1, 
			  roles: 1, 
			  picturePath: 1, 
			  comments: 1}
		);
		if (user) {
			const response = { user: user, errorMessage: "" };
			return response;
		} else {
			return null;
		}
	}

	//Gets roles of the user from the username
	async getRolesByUsername(username) {
		let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
		if (user.roles) {
			return user.roles;
		} else {
			return [];
		}
	}

	//Updates user by the username from the information passed through the parameters
	async updateUserByUsername(username, profileFirstName, profileLastName, profileEmail, profileInterests, profileRoles, deleteProfilePic, picturePath) {
		//Grabs the user
		const profile = await this.getUserByUsername(username);
		
		//Updates the user from the parameters
		profile.user.firstName = profileFirstName;
		profile.user.lastName = profileLastName;
		profile.user.email = profileEmail;
		profile.user.interests = profileInterests;
		profile.user.roles = profileRoles;

		//If they have uploaded a new profile picture, update the user
		if(picturePath){
			profile.user.picturePath = picturePath;
		}

		//deletes the profile picture if the user selected delete
		if(deleteProfilePic){
			profile.user.picturePath = null;
		}

		//Saves the information to the database
		let result = await profile.user.save();
		console.log(profile.user.errors);

		//Returns the updated profile as an object
		return {
			obj: result,
			errorMsg: "",
		};
	}

	//Deletes the user by id
	async deleteUserById(id) {
		let result = await User.findByIdAndDelete(id);
		return result;
	}

	//Add comments to the user
	async addCommentToUser(comment, username) {
		//Grabs the user from the username
		let user = await User.findOne({ username: username });
		//Pushes the comment to the array
		user.comments.push(comment);

		//Try Catch to save the comment to the User
		try {
			let result = await user.save();
			console.log("updated user: ", result);
			const response = { 
				user: result, 
				errorMessage: "" 
			};
			return response;
		} catch (error) {
			console.log("error saving user: ", result);
			const response = { 
				user: user, 
				errorMessage: error 
			};
			return response;
		}
	}
}

module.exports = UserOps;