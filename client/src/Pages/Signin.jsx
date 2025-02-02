// Signin.jsx
import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "../Authetication/Authentication.jsx"

function Signin() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the correct login function from AuthContext
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (password.length < 5) {
      toast.error("Password length should be a minimum of 5 characters");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const resData = await response.json();

      if (response.ok && resData.success) {
        const { token, user } = resData; // Assume response contains token and user info
        console.log(token);
        login(token); // Use login from AuthContext to update state
        toast.success("Signed In Successfully");
        navigate("/");
      } else {
        toast.error(resData.message || "Failed to sign in");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-full w-full">
      <div className="w-96 p-4 text-center m-auto mt-20">
        <h1 className="text-4xl font-serif">Welcome Back!</h1>
        <div className="mt-16 flex flex-col justify-center items-center gap-5">
          <div className="relative flex items-center w-72">
            <FaEnvelope className="absolute left-3 text-gray-500 w-3 h-3" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="bg-slate-200 pl-10 pr-4 py-2 outline-none w-full rounded-lg text-gray-800 placeholder-gray-700 transition duration-200 ease-in-out"
              placeholder="Email"
            />
          </div>
          <div className="relative flex items-center w-72">
            <FaLock className="absolute left-3 text-gray-500 w-3 h-3" />
            <input
              type={passwordVisible ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="bg-slate-200 pl-10 pr-4 py-2 outline-none w-full rounded-lg text-gray-800 placeholder-gray-700 transition duration-200 ease-in-out"
              placeholder="Password"
            />
            {passwordVisible ? (
              <FaEye
                className="absolute right-2 text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() => setPasswordVisible((prev) => !prev)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-2 text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() => setPasswordVisible((prev) => !prev)}
              />
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-3 font-serif shadow-xl hover:scale-105 bg-black text-white rounded-full px-4 py-2"
          >
            Sign In
          </button>
          {/* <div>
            <button className="flex mt-5 px-8 shadow-xl rounded-full hover:scale-105 bg-black text-white p-2">
              <FaGoogle className="mt-1" />
              <span className="pl-3">Continue with Google</span>
            </button>
          </div> */}
          <p>
            Don't Have an Account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
