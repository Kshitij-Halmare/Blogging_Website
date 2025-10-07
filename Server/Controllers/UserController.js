import UserSchema from "../Schemas/UserSchema.js";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs"; // Ensure bcryptjs is installed
import jwt from "jsonwebtoken"
const generateUserName = async (email) => {
    let userName = email.split("@")[0];
    const existingUser = await UserSchema.findOne({ "personal_info.userName": userName });
    return existingUser ? userName + nanoid(6) : userName;
};

const generatewebtoken=(user)=>{
    const payload={
        data:user.personal_info,
        id:user._id
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
    return token;
}

const formatData = (user) => {
    return {
        profile_img: user.personal_info.profile_img,
        userName: user.personal_info.userName,
        full_name: user.personal_info.full_name
    }
}

export async function SignUp(req, res) {
    const { name, email, password } = req.body;
    console.log({ name, email, password });

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All the fields are required",
                data: { name, email, password },
                success: false,
                error: true,
            });
        }

        const existUser = await UserSchema.findOne({ "personal_info.email": email });
        if (existUser) {
            return res.status(400).json({
                message: "User already exists. Please sign in.",
                error: true,
                success: false,
            });
        }

        const userName = await generateUserName(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserSchema({
            personal_info: {
                full_name: name,
                email,
                password: hashedPassword,
                userName,
            },
        });
        const savedUser = await user.save();
        return res.status(200).json({
            message: "Successfully signed up",
            data: formatData(savedUser),
            error: false,
            success: true,
        });
    } catch (err) {

        return res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}


export async function getProfile(req, res) {
    // Destructure username from the request body
    let { username } = req.body;

    // Log username for debugging purposes (optional)
    console.log('Fetching profile for username:', username);
    //  username=username.id
    try {
        // Find user based on the username in the personal_info field
        const user = await UserSchema.findOne({ 'personal_info.userName': username })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }
        console.log(user);
        // If user is found, return the user data
        return res.status(200).json({
            data: user,
            success: true,
            error: false,
        });
    } catch (error) {
        // Handle server errors
        console.error(error); // Optional: For debugging
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
}

export async function updateProfile(req,res) {
    const {profile_img, full_name, email, bio, social_links, username } = req.body;
    // console.log();
    try {
      // If no profile_img is uploaded, we just use the existing one
      const updatedProfileData = {
        'personal_info.full_name':full_name,
        "personal_info.email":email,
        "personal_info.bio":bio,
        "personal_info.profile_img":profile_img,  // This will be either the existing path or a new uploaded path
        social_links: {youtube:social_links.youtube,
            instagram:social_links.instagram,
            facebook:social_links.facebook,
            twitter:social_links.twitter,
            github:social_links.github
        },
      };
      console.log(updatedProfileData);
  
      const user = await UserSchema.findOneAndUpdate({'personal_info.email':email}, updatedProfileData, { new: true });
      console.log(user);
      if (user) {
        res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

export async function geEditProfile(req, res) {
    // Destructure username from the request body
    let { username } = req.body;

    // Log username for debugging purposes (optional)
    console.log('Fetching profile for username:', username);
    try {
        // Find user based on the username in the personal_info field
        const user = await UserSchema.findOne({ 'personal_info.userName': username })
        console.log(user);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }
        console.log(user);
        // If user is found, return the user data
        return res.status(200).json({
            data: user,
            success: true,
            error: false,
        });
    } catch (error) {
        // Handle server errors
        console.error(error); // Optional: For debugging
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
}


export async function Signin(req, res) {
    const { email, password } = req.body;

    try {
        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
                error: true,
            });
        }

        // Check if the user exists
        const user = await UserSchema.findOne({ "personal_info.email": email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }
        console.log(user);
        const isPasswordCorrect = await bcrypt.compare(password, user.personal_info.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect password",
                success: false,
                error: true,
            });
        }
        console.log(user);
        // If the user is authenticated successfully
        return res.status(200).json({
            message: "User authenticated successfully",
            token:generatewebtoken(user),
            user:formatData(user),
            success: true,
            error: false,
        });
    } catch (err) {
        // Handle server errors
        return res.status(500).json({
            message: err.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
}

export async function ChangePassword(req, res) {
    const { data, user } = req.body;
    console.log(data);
    const { currentPassword, ChangePassword } = data;

    console.log(currentPassword, ChangePassword);

    try {
        // 1. Find the user by ID
        const foundUser = await UserSchema.findById(user.id); // Assuming user.id is passed in the request body

        if (!foundUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }

        // 2. Check if current password is correct
        const isPasswordCorrect = await bcrypt.compare(currentPassword, foundUser.personal_info.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect current password",
                success: false,
                error: true,
            });
        }

        // 3. Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(ChangePassword, 10);

        // 4. Update the password in the database
        await UserSchema.findByIdAndUpdate(user.id, {
            "personal_info.password": hashedPassword, // Correct field name
        });

        // 5. Return success response
        return res.status(200).json({
            message: "Password updated successfully",
            success: true,
            error: false,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: true,
        });
    }
}