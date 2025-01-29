import mongoose from "mongoose";
import { faker } from '@faker-js/faker';

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      full_name: {
        type: String,
        required: [true, "Full name is required"],
        minLength: [3, "Full name must be at least 3 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
          /^\S+@\S+\.\S+$/,
          "Please provide a valid email address",
        ],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      userName: {
        type: String,
        unique: true,
      },
      bio: {
        type: String,
        maxLength: [200, "Bio should be a maximum of 200 characters"],
        default: "",
      },
      profile_img: {
        type: String,
        default: faker.image.avatar,
      },
    },
    blog_data: {
      banner_image: {
        type: String,
      },
    },
    social_links: {
      youtube: {
        type: String,
      },
      instagram: {
        type: String,
      },
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      github: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    account_info: {
      total_posts: {
        type: Number,
      },
      total_reads: {
        type: Number,
      },
    },
    google_auth: {
      type: Boolean,
    },
    blogs: {
      type:[{
        title:{
          type:String,
          required:true
        },
        banner:{
          type:String,
          required:true
        }
      }]
    },

  },
  {
    timestamps: { createdAt: "joinedAt", updatedAt: true },
    minimize: true, // Avoid creating empty objects for sub-documents
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
