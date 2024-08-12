import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getAllPosts = async (req, res) => {
  try {
    // const posts = await Post.find().sort({createdAt: -1}).populate("user").select("-password");
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User is not Found !" });

    if (!text && !img)
      return res
        .status(400)
        .json({ message: "Post must have The text Or Image" });

    if (img) {
      const uploadedResponce = await cloudinary.uploader.upload(img);
      img = uploadedResponce.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in create post controller", error);
  }
};

export const deletePost = async (req, res) => {
  console.log(req.user);
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not Found !" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: " You are not authoried to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "This post successfull Deleted !" });
  } catch (error) {
    res.status(404).josn(error);
    console.log("Internal error form Post controller", error);
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: "You must write Comment !" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not Found !" });
    }
    // Comment
    const comment = { user: userId, text };

    post.comments.push(comment);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Internal error form post controller", error);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    console.log(post);

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike Post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Unlike the post successfully !" });
    } else {
      // Like the post
      post.likes.push(userId);
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      // Notification send
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();
      res.status(200).json({ message: "Like the post Successfully :)" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getLikesPost = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    console.log(user);

    if (!user) return res.status(404).json({ message: " User not Found !" });

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
    console.log(" Erorr form post controller !", error);
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const following = user.following;
    const followingPost = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" });
    res.status(200).json(followingPost);
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not Found !" });
    const post = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: " -password" })
      .populate({ path: "comments", select: "-password" });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};
