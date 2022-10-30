import { Request, RequestHandler, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";

// Get comments by post id
const getComments: RequestHandler = async (req: Request, res: Response) => {
  const currentComment = await Comment.find({ postID: req.params.id });
  if (currentComment) {
    res.status(200).json(currentComment);
  } else {
    res.status(404).json({ message: "No Comment found" });
  }
};

// Add a comment to a post
const createComment = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.id);
  if (user) {
    const { content, createdAt } = req.body;
    const newComment = new Comment({
      postID: req.params.id,
      content: content,
      user: user.id,
      username: user.username,
      createdAt: createdAt,
    });
    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: newComment },
    });

    const savedComment = await newComment.save();

    if (savedComment) {
      res.status(200).json({ message: "Comment created successfully" });
    }
  } else {
    res.status(404).json({ message: "Comment not created" });
  }
};

// Edit a comment
const editComment = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    const commentId: string = req.params.id;
    const comment: any = await Comment.findById(commentId);
    // Only comment author is allowed to edit
    if (user._id.toString() === comment.user.toString()) {
      const editComment = await Comment.findByIdAndUpdate(commentId, {
        content: req.body.content,
      });
      if (editComment) {
        res.status(200).json({ message: "Comment edited successfully" });
      }
    } else {
      res
        .status(403)
        .json({ message: "You are not allowed to edit this comment" });
    }
  } catch (err) {
    res.status(500).json({ message: "Comment not edited" });
  }
};

// Delete a comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);
    // Only admins and post author are allowed to delete posts
    const commentId: string = req.params.id;
    const comment: any = await Comment.findById(commentId);
    if (
      user.isAdmin === true ||
      user._id.toString() === comment.user.toString()
    ) {
      const deleteCommentById = await Comment.findByIdAndDelete(commentId);
      const deleteCommentFromPost = await Post.findByIdAndUpdate(
        comment.postID,
        { $pull: { comments: commentId } }
      );
      if (deleteCommentById && deleteCommentFromPost) {
        res.status(200).json({ message: "Comment deleted successfully" });
      }
    } else {
      res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export { getComments, createComment, deleteComment, editComment };
