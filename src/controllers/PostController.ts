import { Request, RequestHandler, Response } from "express";
import CommunityThread from "../models/CommunityThread";
import Post, { IPost } from "../models/Post";
import User from "../models/User";

// Get all posts by thread id
const getPosts: RequestHandler = async (req: Request, res: Response) => {
  const currentPost = await Post.find({
    threadID: req.params.id,
  });
  if (currentPost) {
    res.status(200).json(currentPost);
  } else {
    res.status(404).json({ message: "No post found" });
  }
};

// Get a post by id
const getPost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
};

// Create a new post
const createPost = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.id);
  if (user) {
    const { title, text, createdAt } = req.body;
    const newPost = new Post({
      threadID: req.params.id,
      title: title,
      text: text,
      user: user.id,
      username: user.username,
      createdAt: createdAt,
    });
    await CommunityThread.findByIdAndUpdate(req.params.id, {
      $push: { posts: newPost },
    });

    const savedPost = await newPost.save();
    user.posts.push(newPost);
    const pushedPost = await user.save();

    if (savedPost && pushedPost) {
      res.status(201).json({ message: "Post created successfully" });
    }
  } else {
    res.status(404).json({ message: "Post not created" });
  }
};

// Edit a post title and text
const editPost = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    const postId: string = req.params.id;
    const post: any = await Post.findById(postId);
    // Only post author is allowed to edit
    if (user._id.toString() === post.user.toString()) {
      const editPost = await Post.findByIdAndUpdate(postId, {
        title: req.body.title,
        text: req.body.text,
      });
      if (editPost) {
        res.status(200).json({ message: "Post edited successfully" });
      }
    } else {
      res
        .status(403)
        .json({ message: "You are not allowed to edit this post" });
    }
  } catch (err) {
    res.status(500).json({ message: "Post not edited" });
  }
};

// Delete a post
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    // Only admins and post author are allowed to delete posts
    const postId: string = req.params.id;
    const post: any = await Post.findById(postId);
    if (user.isAdmin === true || user._id.toString() === post.user.toString()) {
      const deletePostById = await Post.findByIdAndDelete(postId);
      const deletePostFromThread = await CommunityThread.findByIdAndUpdate(
        post.threadID,
        { $pull: { posts: postId } }
      );
      const deletePostFromUser = await User.findByIdAndUpdate(post.user, {
        $pull: { posts: postId },
      });
      if (deletePostById && deletePostFromThread && deletePostFromUser) {
        res.status(200).json({ message: "Post deleted successfully" });
      }
    } else {
      res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export { createPost, getPosts, getPost, editPost, deletePost };
