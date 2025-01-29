import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 200,
      // required: true
    },
    banner: {
      type: String,
      required: true,
    },
    content: {
      type: [Schema.Types.Mixed], // Allows more flexibility for different types of content
      // required: true
    },
    tags: {
      type: [String],
      // required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Ensuring this references a User document
      // required: true,
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'publishedAt' } }
);

export default mongoose.model("Blog", blogSchema);
