import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authetication/Authentication';
import toast from "react-hot-toast";
import { FaFacebook, FaGithub, FaInstagram, FaTwitter, FaYoutube, FaLink, FaUser } from 'react-icons/fa';

function EditProfile() {
  const { user } = useAuth();
  let username = null;

  // Initialize formData with default values (ensuring no undefined values)
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '', // Default empty string to prevent uncontrolled input
    email: '',
    bio: '',
    profile_img: '', // Base64 string will be stored here
    profile_img_file: null, // Not needed for Base64 storage
    social_links: {
      youtube: '',
      instagram: '',
      facebook: '',
      twitter: '',
      github: '',
      website: ''
    }
  });

  // Fetch user profile data from the backend
  const getProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getEditProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Send the username to the backend
      });

      const resData = await response.json();
      if (resData.success) {
        setData(resData.data); // Store profile data if successful
        const personalInfo = resData.data.personal_info || {}; // Set form data, handling any missing fields gracefully
        setFormData({
          full_name: personalInfo.full_name || '',
          email: personalInfo.email || '',
          bio: personalInfo.bio || '',
          profile_img: personalInfo.profile_img || '', // Default to empty string if missing
          profile_img_file: null, // Reset file field
          social_links: resData.data.social_links || { youtube: '', instagram: '', facebook: '', twitter: '', github: '', website: '' },
        });
      } else {
        console.error('Error fetching profile:', resData.message);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (!user) {
      toast("Please Signin");
      return;
    } else {
      username = user.data.userName;
      getProfile(); // Fetch profile data when the component loads
    }
  }, [user]);

  // Handle input changes for all fields (personal and social)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for social media links
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      social_links: {
        ...prevData.social_links,
        [name]: value,
      }
    }));
  };

  // Handle form submission (e.g., save the changes)
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Optional: Form validation (e.g., check if required fields are filled)
    if (!formData.full_name || !formData.email) {
      toast.error("Full Name and Email are required.");
      return;
    }

    // Prepare the data to be sent to the backend
    const updatedProfileData = {
      full_name: formData.full_name,
      email: formData.email,
      bio: formData.bio,
      profile_img: formData.profile_img, // Now we send the Base64 image string
      social_links: formData.social_links,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/updateProfile`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfileData), // Send the Base64 string along with other data
      });

      const resData = await response.json();
      if (resData.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(`Error: ${resData.message || "Something went wrong!"}`);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error("An error occurred while updating your profile.");
    }
  };

  // Handle profile image file change (convert to Base64)
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1]; // Get the Base64 string without the data URL part
        setFormData((prevData) => ({
          ...prevData,
          profile_img: base64Image, // Store Base64 string for upload
          profile_img_file: file, // You may still keep the file if you need it for validation or other purposes
        }));
      };
      reader.readAsDataURL(file); // Convert the image to Base64
    }
  };
  console.log(formData);
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-16">
      <h1 className="text-4xl font-serif text-gray-800 text-center mb-8">Edit Profile</h1>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <form onSubmit={handleSaveChanges} className="space-y-8">
          {/* Profile Image Section */}
          <label htmlFor="uploadImage" className="cursor-pointer">
            <div className='flex justify-center'>
              {formData.profile_img ? (
                <img src={`data:image/jpeg;base64,${formData.profile_img}`} alt="" className='w-48 h-48 rounded-full hover:shadow-md hover:opacity-50' />
              ) : (
                <FaUser className='text-2xl text-gray-600 hover:text-gray-900 hover:shadow-md' />
              )}
            </div>
            <input
              id="uploadImage"
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </label>

          {/* Personal Info Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength="200"
                placeholder="Write a short bio..."
              />
            </div>
          </div>

          {/* Social Links Section */}
          <h3 className="text-2xl font-semibold text-gray-800 mt-8">Social Links</h3>
          <div className="space-y-6 mt-4">
            {[
              { name: 'facebook', icon: <FaFacebook className="text-blue-600" />, placeholder: 'Facebook URL' },
              { name: 'instagram', icon: <FaInstagram className="text-pink-600" />, placeholder: 'Instagram URL' },
              { name: 'twitter', icon: <FaTwitter className="text-blue-400" />, placeholder: 'Twitter URL' },
              { name: 'github', icon: <FaGithub className="text-gray-800" />, placeholder: 'GitHub URL' },
              { name: 'youtube', icon: <FaYoutube className="text-red-600" />, placeholder: 'YouTube URL' },
              { name: 'website', icon: <FaLink className="text-gray-500" />, placeholder: 'Website URL' }
            ].map(({ name, icon, placeholder }) => (
              <div key={name} className="flex items-center space-x-4">
                <div className="text-xl">{icon}</div>
                <input
                  type="text"
                  name={name}
                  value={formData.social_links[name] || ''}
                  onChange={handleSocialLinkChange}
                  placeholder={placeholder}
                  className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white text-lg font-medium rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditProfile;
