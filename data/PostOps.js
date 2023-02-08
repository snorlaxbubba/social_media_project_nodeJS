const Post = require("../models/Post");

class PostOps {
    PostOps() {}

	async getAllPosts() {
		let posts = await (await Post.model.find()).reverse();
		console.log(posts)
		return posts;
	}
}

module.exports = PostOps;