import { nanoid } from "nanoid";
import BlogSchema from "../Schemas/BlogSchema.js";
import UserSchema from "../Schemas/UserSchema.js";
import Notification from "../Schemas/Notification.js";
import mongoose from "mongoose"
import Blog from "../Schemas/BlogSchema.js"
import CommentSchema from "../Schemas/CommentSchema.js";
const generateBlogId = (userName) => {
  return `${userName}-${nanoid(8)}`;
};

export async function trendingBlog(req, res) {
  try {
    const maxLimit = 10;

    // Fetch the data with filtering, populating, sorting, and limiting
    const data = await BlogSchema.find({ draft: false })
      .populate("author", "personal_info.full_name personal_info.userName personal_info.profile_img -_id") // Populate only necessary fields
      .sort({ "activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1 }) // Sort by multiple fields
      .select("blog_id title publishedAt -_id") // Select specific fields
      .limit(maxLimit); // Limit the number of blogs retrieved

    // Respond with the retrieved data
    return res.status(200).json({
      message: "Retrieved successfully",
      data: data,
      error: false,
      success: true
    });

  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching trending blogs:', error);

    // Respond with error details
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true
    });
  }
}

export async function FindUser(req, res) {
  const { query } = req.body;
  try {
    const data = await UserSchema.find({ "personal_info.userName": new RegExp(query, "i") })
      .limit(50)
      .select("personal_info.full_name personal_info.userName personal_info.profile_img -_id");
    // console.log("adata", data);
    // Check if users were found
    if (data.length > 0) {
      return res.status(200).json({
        message: "User(s) found",
        data: data,
        success: true,
        error: false
      });
    }

    // If no users found
    return res.status(404).json({
      message: "No user found",
      error: true,
      success: false
    });
  } catch (err) {
    // Catch any errors
    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false
    });
  }
}


export async function getNotification(req, res) {
  // Destructure the user_id directly from the request body
  const { user_id } = req.body;
  console.log(user_id);  // This should now print the correct user_id

  try {
    // Use the correct user_id to query the notifications
    const data = await Notification.find({ notification_for: user_id, seen: false, user: { $ne: user_id } });
    console.log("notification", data);
    if (data && data.length > 0) { // Ensure data exists and contains notifications
      return res.status(200).json({
        new_notification_available: true,
        data: data,
        success: true
      });
    } else {
      return res.status(200).json({
        new_notification_available: false,
        success: true
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
}


export async function getSpecificTag(req, res) {
  const maxLimit = 3;
  const { query, category, page } = req.body;  // Expect 'query' or 'category' in the request body
  console.log({ query, category, page });
  let findQuery = { draft: false }; // Start by excluding drafts

  // Check if category is provided, and ensure it's an array, else fallback to search by query
  if (category && Array.isArray(category) && category.length > 0) {
    // Filter blogs by any tags in the provided category array
    findQuery = { ...findQuery, tags: { $in: category } }; // $in will match any of the tags in the 'category' array
  } else if (category && !Array.isArray(category)) {
    // Handle case where category is a single tag (if not an array)
    findQuery = { ...findQuery, tags: { $in: [category] } }; // Treat as a single tag
  }

  if (query) {
    // Use $or operator to check if any field (tags, title, or description) contains the query
    findQuery = {
      ...findQuery,
      $or: [
        { title: new RegExp(query, "i") }, // Search in 'title'
        { description: new RegExp(query, "i") }, // Search in 'description'
        { tags: new RegExp(query, "i") } // Search in 'tags' array
      ]
    };
  }
  console.log("tag", findQuery);

  try {
    // Fetch the blogs from the database
    const response = await BlogSchema.find(findQuery)
      .populate("author", "personal_info.full_name personal_info.userName personal_info.profile_img -_id") // Populate author details
      .sort({ publishedAt: -1 }) // Sort by published date
      .select("blog_id title description banner activity tags publishedAt author -_id") // Select required fields
      .skip((page - 1) * maxLimit) // Pagination
      .limit(maxLimit); // Limit results per page

    // If no blogs are found, return a 404 response
    if (response.length === 0) {
      return res.status(404).json({
        message: 'No blogs found with the specified category or query',
        success: false,
      });
    }

    // Return the fetched data
    return res.status(200).json({
      message: 'Successfully fetched blogs with the specified category or query',
      success: true,
      data: response,
    });

  } catch (error) {
    // Catch any errors and send a 500 response
    console.error('Error while fetching blogs:', error);
    return res.status(500).json({
      message: 'An error occurred while fetching blogs',
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}


export async function getCountBlog(req, res) {
  try {
    // Extract the data_to_send value from the request body
    let { data_to_send } = req.body;
    if (data_to_send.category != null) {
      data_to_send = data_to_send.category;
    }
    // console.log('Received data_to_send:', data_to_send); // Log the received value for debugging

    // Ensure that data_to_send is a string or convert it to a string if it's an object
    const query = typeof data_to_send === 'string' ? data_to_send.trim() : '';

    // Build the initial filter query for non-draft blogs
    const filterQuery = { draft: false };

    // If data_to_send is a non-empty string, add it to the query for filtering
    if (query !== '') {
      filterQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [query] } },
      ];
    }
    // console.log(filterQuery);
    // Logging the final filter query
    // console.log('Final Find Query:', filterQuery);

    // Count the number of documents matching the filter query
    const count = await BlogSchema.countDocuments(filterQuery);

    // Respond with the count result
    return res.status(200).json({
      message: "Successfully retrieved blog count",
      success: true,
      error: false,
      count: count,
    });
  } catch (err) {
    console.log('Error:', err);
    return res.status(500).json({
      message: "Failed to retrieve blog count",
      success: false,
      error: true,
      errorMessage: err.message,
    });
  }
}


export async function updateLike(req, res) {
  const { blog_id, user_id, isLiked } = req.body; // Get blog_id, user_id, and isLiked value from request body
  const incrementalValue = isLiked ? 1 : -1; // Increment or decrement based on the like/dislike action
  console.log({ blog_id, user_id, isLiked });
  try {
    // Find the blog and update the total_likes count
    const blog = await BlogSchema.findOneAndUpdate(
      { _id: blog_id },
      { $inc: { "activity.total_likes": incrementalValue } },
      { new: true } // Ensure the updated blog is returned
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (isLiked) {
      // If the user is liking the blog, create a notification
      const notification = new Notification({
        type: "like",
        blog: blog._id,
        notification_for: blog.author, // Notify the blog's author
        user: user_id,  // The user who liked the blog
      });

      await notification.save();
      return res.status(200).json({
        message: "Like updated successfully",
        updatedLikes: blog.activity.total_likes,
        notification: notification,
      });
    } else {
      // If the user is unliking the blog, delete the notification
      const notification = await Notification.findOneAndDelete({
        blog: blog._id,
        type: "like",
        user: user_id,
      });

      if (!notification) {
        return res.status(400).json({ message: "Notification not found to remove" });
      }

      return res.status(200).json({
        message: "Like removed successfully",
        updatedLikes: blog.activity.total_likes,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}



export async function getBlog(req, res) {
  try {
    const { page } = req.body;
    const maxLimit = 3;
    // console.log("page",page);
    // Fetch blogs with necessary fields populated
    const data = await BlogSchema.find({ draft: false })
      .populate("author", "personal_info.full_name personal_info.userName personal_info.profile_img -_id") // Populate author with specific fields
      .sort({ "publishedAt": -1 })
      .select("blog_id title description banner activity tags publishedAt author -_id")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);
    // console.log(data);
    return res.status(200).json({
      message: "Successfully Retrieved",
      data: data,
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
      error: true,
    });
  }
}

export async function PublishBlog(req, res) {
  const resdata = req.body;
  const data = resdata.blog; // Blog data from request body

  try {
    // Validate input
    if (!data.title) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Title Required"
      });
    }

    if (!data.banner) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Banner Required"
      });
    }

    if (!data.description) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Description Required"
      });
    }

    if (!data.content) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Content Required"
      });
    }

    if (data.tags.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Tags Required"
      });
    }

    // Check if we are updating an existing blog
    if (resdata.blog_id) {
      // Update existing blog by blog_id
      const blogId = resdata.blog_id; // Get blog_id from request data
      const blogUpdate = {
        title: data.title,
        banner: data.banner,
        description: data.description,
        content: data.content,
        tags: data.tags,
        draft: Boolean(resdata.draft)
      };

      const updatedBlog = await BlogSchema.findOneAndUpdate({ blog_id: blogId }, blogUpdate, { new: true });

      if (!updatedBlog) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Blog not found"
        });
      }

      return res.status(200).json({
        message: "Blog updated successfully",
        success: true,
        error: false,
        data: updatedBlog
      });
    }

    // Check if the author has already published a blog with the same title
    const existingBlog = await BlogSchema.findOne({
      author: resdata.authorId,
      title: data.title, // Check for duplicate title
    });

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "You have already published a blog with this title."
      });
    }

    // Generate a unique blog ID (assuming you have a function for it)
    const authorName = resdata.authorId || 'unknown-author'; // Fallback in case authorName is missing
    const blog_id = generateBlogId(authorName); // Generate blog_id using authorName

    // Ensure authorId is treated as an ObjectId
    const authorId = new mongoose.Types.ObjectId(resdata.authorId);  // Fix applied here

    // Create new blog
    const blog = new BlogSchema({
      blog_id: blog_id,
      title: data.title,
      banner: data.banner,
      description: data.description,
      content: data.content,
      tags: data.tags,
      author: authorId,
      draft: Boolean(resdata.draft)
    });

    const savedBlog = await blog.save();

    // Update the user's blogs array with the new blog reference and title
    const user = await UserSchema.findById(authorId);
    if (user) {
      // Push both the ObjectId and title of the blog into the blogs array
      user.blogs.push({
        title: blog.title,
        banner: blog.banner,
      });  // Push only the ObjectId
      await user.save(); // Save the updated user
    }
    console.log(user);
    return res.status(200).json({
      message: "Blog published successfully",
      success: true,
      error: false,
      data: savedBlog
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
      success: false,
      error: true
    });
  }
}

export async function DraftBlog(req, res) {
  const resData = req.body;
  const { blog, authorId, draft, blog_id } = resData;
  console.log({ blog, authorId, draft, blog_id });
  if (!authorId) {
    return res.status(400).json({
      success: false,
      message: "Author ID is required"
    });
  }

  try {
    // If blog_id is present, update the existing blog
    if (blog_id) {
      const blogUpdate = {
        title: blog.title,
        banner: blog.banner,
        description: blog.description,
        content: blog.content,
        tags: blog.tags,
        draft: Boolean(draft)  // Ensuring draft is treated as a boolean
      };

      const updatedBlog = await BlogSchema.findOneAndUpdate({ blog_id }, blogUpdate, { new: true });

      if (!updatedBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog
      });
    }

    // Check for existing draft with the same title by the same author
    const existingBlog = await BlogSchema.findOne({
      author: authorId,
      title: blog.title,
      draft: Boolean(draft)  // Checking the draft status
    });

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "You have already saved a draft with this title."
      });
    }

    // Generate a unique blog ID
    const authorName = authorId || 'unknown-author';  // Fallback if authorId is invalid
    const newBlogId = generateBlogId(authorName);  // Assuming generateBlogId works with author name

    // Ensure authorId is treated as an ObjectId
    const author = new mongoose.Types.ObjectId(authorId);

    // Create a new blog entry
    const newBlog = new BlogSchema({
      blog_id: newBlogId,
      title: blog.title,
      banner: blog.banner,
      description: blog.description,
      content: blog.content,
      tags: blog.tags,
      author,
      draft: Boolean(draft)
    });

    // Save the blog to the database
    const savedBlog = await newBlog.save();

    // Update the user's blogs array with the new blog reference
    const user = await UserSchema.findById(author);
    if (user) {
      user.blogs.push({
        title: newBlog.title,
        banner: newBlog.banner
      });
      await user.save();  // Save the updated user
    }

    return res.status(200).json({
      success: true,
      message: "Blog saved as draft successfully",
      data: savedBlog
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the blog",
      error: err.message
    });
  }
}



export async function addComment(req, res) {
  const { user_id, blog_id, comment, replying_to, blog_author } = req.body;
  console.log({ user_id, blog_id, comment, replying_to, blog_author });

  try {
    // Check if the comment is empty
    if (!comment || !comment.length) {
      return res.status(400).json({
        message: "Write something in the comment",
        success: false,
        error: true
      });
    }

    // Ensure the user exists
    const user = await UserSchema.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true
      });
    }

    // Create the comment object
    let commentObj = {
      blog_id: blog_id,
      blog_author: blog_author,
      comment: comment,
      commented_by: user_id,
      replying_to: replying_to || null,
    };

    // If replying to another comment, set the parent field
    if (replying_to) {
      commentObj.isReply = true;
      commentObj.parent = replying_to;
    }

    // Create the new comment in the database
    const newComment = await CommentSchema.create(commentObj);

    // Populate the 'commented_by' field with user data
    const populatedComment = await CommentSchema.findById(newComment._id)
      .populate("commented_by", "personal_info.full_name personal_info.userName personal_info.profile_img");

    console.log(populatedComment);

    let { comment: newCommentText, commentedAt, children, commented_by } = populatedComment;

    // Update the Blog with the new comment (first update)
    await BlogSchema.findByIdAndUpdate(
      blog_id,
      {
        $push: { comments: newComment._id },
        $inc: { "activity.total_comments": 1 }, // Increment total_comments
      }
    );

    // Second update: Update total_parent_comments based on whether it's a reply
    if (!replying_to) {
      await BlogSchema.findByIdAndUpdate(
        blog_id,
        {
          $inc: { "activity.total_parent_comments": 1 }, // Increment total_parent_comments for non-replies
        }
      );
    }

    // Create the notification object
    let NotificationObj = {
      type: replying_to ? "reply" : "comment",
      blog: blog_id,
      notification_for: blog_author,
      user: user_id,
      comment: newComment._id,
    };

    if (replying_to) {
      NotificationObj.replied_on_comment = replying_to;

      // Update the replying comment with the new child comment
      await CommentSchema.findByIdAndUpdate(replying_to, {
        $push: { children: newComment._id }
      });

      // Update the notification_for to the comment's author
      const replyingToComment = await CommentSchema.findById(replying_to);
      NotificationObj.notification_for = replyingToComment.commented_by;
    }

    // Create and save the new notification
    const newNotification = new Notification(NotificationObj);
    await newNotification.save();

    // Respond back with the new comment, now populated with user data
    return res.status(200).json({
      message: "New Comment Added",
      data: {
        comment: newCommentText,
        commentedAt,
        _id: newComment._id,
        user_id,
        children,
        user: commented_by
      },
      error: false,
      success: true
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "An error occurred",
      error: true,
      success: false
    });
  }
}


export async function getBlogData(req, res) {
  const { id, draft, mode } = req.body;
  let incrementalValue = 1;

  if (mode === "edit") {
    incrementalValue = 0;
  }

  console.log("id",id);

  try {
    const blog = await BlogSchema.findOneAndUpdate(
      { blog_id: id },
      { $inc: { "activity.total_reads": incrementalValue } },
      { new: true }
    )
      .populate("author", "personal_info.full_name personal_info.userName personal_info.profile_img")
      .select("title description banner content activity publishedAt blog_id tags draft");
    console.log(blog);
    await UserSchema.findOneAndUpdate(
      { "personal_info.userName": blog.author.personal_info.userName },
      { $inc: { "account_info.total_reads": incrementalValue } }  // This line is not needed
    );

    return res.status(200).json({
      message: "Successfully retrieved",
      data: blog,
      success: true
    });


  } catch (err) {
    // Handle and log any errors
    console.error(err);  // Log the error for debugging

    return res.status(500).json({
      message: err.message || "Internal server error",
      success: false
    });
  }
}



export async function isLikedByUser(req, res) {
  try {
    const { blog_id, user_id } = req.body;
    // console.log({ blog_id, user_id });
    const data = await Notification.findOne({
      blog: blog_id,
      type: "like",
      user: user_id
    });
    // console.log(data);

    if (data) {
      return res.status(200).json({
        message: "Successfully retrieved",
        success: true,
        data: true
      });
    }

    return res.status(400).json({
      message: "Data not found",
      success: false,
      data: false
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true
    });
  }
}



export async function getCommentData(req, res) {
  let { blog_id, skip } = req.body;
  // console.log("coomentData", blog_id, skip);
  let maxLimit = 5;
  try {
    const data = await CommentSchema.find({ blog_id: blog_id, isReply: false })
      .populate("commented_by", "personal_info.full_name personal_info.userName personal_info.profile_img")
      .skip(skip)
      .limit(maxLimit)
      .sort({ "commentedAt": -1 });
    // console.log(data);
    return res.status(200).json({
      message: "Retrieved successfully",
      data: data,
      success: true
    })

  } catch (err) {
    return res.status(500).json({
      message: err,
      success: false,
      error: true
    })
  }

}


export async function notification(req, res) {
  const { page, filter, deletedDocCount, user_id } = req.body;
  // console.log({ page, filter, deletedDocCount, user_id });

  try {
    const maxLimit = 5; // Maximum documents per page
    let findQuery = { notification_for: user_id, user: { $ne: user_id },seen:false }; // Query to find notifications for the user
    let skipDocs = (page - 1) * maxLimit;

    // Apply filter if it's not "All"
    if (filter && filter !== "All") {
      findQuery.type = filter;
    }

    // Adjust skipDocs if there are deleted documents
    if (deletedDocCount) {
      skipDocs -= deletedDocCount;
    }
    console.log(findQuery);
    // Ensure valid page number and limit
    if (page <= 0) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    // Fetch notifications from the database
    const data = await Notification.find(findQuery)
      // .skip(skipDocs)
      // .limit(maxLimit)
      .populate("blog", "title blog_id")
      .populate("user", "personal_info.full_name personal_info.userName personal_info.profile_img")
      .populate("comment", "comment")  // Using the correct reference name
      .sort({ createdAt: -1 })
      .select("createdAt type seen");

    return res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      message: err.message || "An error occurred while fetching notifications.",
    });
  }
}
export async function allNotificationCount(req, res) {
  const { user_id, filter } = req.body;

  try {
    // Define the initial query
    let findQuery = { notification_for: user_id, user: { $ne: user_id } };

    // If a filter is provided, add it to the query
    if (filter && filter !== 'all') {
      findQuery.type = filter;
    }

    // Get the count of documents matching the query
    const data = await Notification.countDocuments(findQuery);
    console.log(data);
    // Return the success respons console
    return res.status(200).json({
      message: "success", // consistent use of 'message'
      data: data
    });

  } catch (err) {
    // Return the error response
    return res.status(500).json({
      message: err.message || "An error occurred while fetching notification count."
    });
  }
}

export async function SetSeenNotification(req, res) {
  const { user_id } = req.body;
  try {
    const result = await Notification.updateMany(
      {
        notification_for: user_id,
        seen: false,
      },
      {
        $set: { seen: true }, // Set 'seen' to true
      }
    );

    res.status(200).json({
      message: 'Notifications marked as seen.',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating notifications.',
      error: error.message,
    });
  }
}

export async function fetchBlog(req, res) {
  const { user_id, isDraft } = req.body;
  // console.log(user_id, isDraft);
  try {
    const data = await BlogSchema.find({ author: user_id, draft: isDraft });
    return res.status(200).json({
      message: "SuccessFully retreived",
      data: data,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      message: err,
      success: false
    })
  }
}

export async function BlogDelete(req,res){
  const {blogId}=req.body;
  if(!blogId){
    return res.status(400).json({ success: false, message: 'Blog ID is required' });
  }
  try{
    const blog=await BlogSchema.findByIdAndDelete(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  }catch(err){
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}