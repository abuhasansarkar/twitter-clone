import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

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

    console.log("postid/", postId, "userId/", userId);
    if(!text){
        return res.status(400).json({message: "You must write Comment !"})
    }

    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({message: "Post not Found !"})
    }
    // Comment
    const comment = {user: userId, text}

    post.comments.push(comment);

   await post.save();

    res.status(200).json(post);

  } catch (error) {
    console.log("Internal error form post controller", error);
  }
};
