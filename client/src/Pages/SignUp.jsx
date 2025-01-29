import React, { useState } from 'react'
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaLock, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"
function SignUp() {
    const navigate = useNavigate();
    const [password, seePassword] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const handleSubmit = async () => {
        console.log(data);
        if (!data.name || !data.email || !data.password) {
            toast.error("name,email,password required");
            return;
        }
        if (password.length < 5) {
            toast.error("Password length should be minimum of length 5");
            return;
        }
        console.log(import.meta.env.VITE_SERVER_DOMAIN);
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: data.name, email: data.email, password: data.password }) // Correct property
        });

        const resData = await response.json();
        if (resData.success) {
            toast.success("User Signed Up SuccessFully");
        } else {
            toast.error(resData.message);
        }
    }
    return (
        <div className='h-full w-full '>
            <div className='w-96 p-4 text-center m-auto mt-20'>
                <h1 className='text-4xl font-serif '>Join Us Today</h1>
                <div className='mt-16 flex flex-col justify-center items-center gap-5'>
                    <div className="relative flex items-center w-72">
                        <FaUser className="absolute left-3 text-gray-500 w-3 h-3" />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                            className="bg-slate-200 pl-10 pr-4 py-2 outline-none w-full rounded-lg text-gray-800 placeholder-gray-700 transition duration-200 ease-in-out"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="relative flex items-center w-72">
                        <FaEnvelope className="absolute left-3 text-gray-500 w-3 h-3" />
                        <input
                            type="text"
                            value={data.email}
                            onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                            className="bg-slate-200 pl-10 pr-4 py-2 outline-none w-full rounded-lg text-gray-800 placeholder-gray-700 transition duration-200 ease-in-out"
                            placeholder="Email"
                        />
                    </div>
                    <div className="relative flex items-center w-72">
                        <FaLock className="absolute left-3 text-gray-500 w-3 h-3" />
                        <input
                            type={`${password ? "text" : "password"}`}
                            onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                            value={data.password}
                            className={`bg-slate-200 pl-10 pr-4 py-2 outline-none w-full rounded-lg text-gray-800 placeholder-gray-700 transition duration-200 ease-in-out`}
                            placeholder="Password"
                        />
                        {
                            password ? (
                                <FaEye className='absolute right-2 text-gray-500 w-5 h-5 cursor-pointer' onClick={() => seePassword((prev) => !prev)} />
                            ) : (
                                <FaEyeSlash className='absolute right-2 text-gray-500 w-5 h-5 cursor-pointer' onClick={() => seePassword((prev) => !prev)} />
                            )
                        }
                    </div>
                    <button onClick={handleSubmit} className='mt-3 font-serif shadow-xl hover:scale-105 bg-black text-white rounded-full px-4 py-2'>
                        Sign Up
                    </button>
                    <div className=''>
                        <button className='flex mt-5 px-8 shadow-xl rounded-full hover:scale-105  bg-black text-white p-2'>
                            <FaGoogle className='mt-1' />
                            <span className='pl-3'>Continue with Google</span>
                        </button>
                    </div>
                    <p>Already Have an Account? <span onClick={() => { navigate("/signin") }} className='text-gray-700 hover:text-gray-900 cursor-pointer'>Sign in</span></p>
                </div>
            </div>
        </div>
    )
}

export default SignUp