import express from "express";
import { ChangePassword, getProfile, Signin, SignUp,geEditProfile,updateProfile } from "../Controllers/UserController.js";
import { v2 as cloudinaryV2 } from "cloudinary";
import multer from "multer";
import UserSchema from "../Schemas/UserSchema.js";
import {PublishBlog, getBlog, getCountBlog,FindUser, getSpecificTag, trendingBlog, getBlogData, updateLike, isLikedByUser, addComment, getCommentData, DraftBlog, getNotification, notification, SetSeenNotification, fetchBlog, BlogDelete } from "../Controllers/BlogController.js"
const userRouter = express.Router();

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: "doczqznfj",
  api_key: "331487941319189",
  api_secret: "ZxPE3EDiA6M8dnsv8TiI3bRHqjE",
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload blog banner route
userRouter.post("/upload-blog-banner/:userId", upload.single("image"), async (req, res) => {
  try {
    const userEmail = req.params.userId; // Assuming userId is actually the email
    console.log("User Email:", userEmail);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload image to Cloudinary with timeout settings
    const result = await cloudinaryV2.uploader.upload(base64Image, {
      folder: "blogUpload",
      timeout: 60000, // Set timeout to 60 seconds (adjust as needed)
    });

    // Save the URL in the database
    const updatedUser = await UserSchema.findOneAndUpdate(
      { "personal_info.email": userEmail },
      { "blog_data.Banner_image": result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "Blog banner uploaded successfully.",
      bannerImageUrl: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading blog banner:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

userRouter.post("/createDraft",DraftBlog);
userRouter.post("/signin", Signin);
userRouter.post("/signup", SignUp);
userRouter.post("/createBlog",PublishBlog);
userRouter.post("/getBlog",getBlog);
userRouter.get("/trendingBlog",trendingBlog);
userRouter.post("/getSpecificTag",getSpecificTag);
userRouter.post("/all-latestlblog-count",getCountBlog)
userRouter.post("/findUser",FindUser);
userRouter.post("/getProfile",getProfile);
userRouter.post("/getEditProfile",geEditProfile);
userRouter.post("/changePassword",ChangePassword);
userRouter.post("/getBlogData",getBlogData);
userRouter.post("/updateLike",updateLike);
userRouter.post("/isLikedUser",isLikedByUser);
userRouter.post("/addComment",addComment);
userRouter.post("/updateProfile",updateProfile);
userRouter.post("/getCommentData",getCommentData);
userRouter.post("/getNotification",getNotification);
userRouter.post("/notifications",notification);
userRouter.post("/setSeenNotification",SetSeenNotification);
userRouter.post("/fetchBlogs",fetchBlog);
userRouter.delete("/deleteBlog",BlogDelete);

export default userRouter;
