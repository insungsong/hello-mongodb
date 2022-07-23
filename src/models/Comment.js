import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
      index: true
    },
    userFullName: {
      type: String,
      required: true
    },
    blog: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "blog"
    }
  },
  {
    timestamps: true
  }
);

export const Comment = mongoose.model("comment", CommentSchema);

export default { Comment, CommentSchema };
