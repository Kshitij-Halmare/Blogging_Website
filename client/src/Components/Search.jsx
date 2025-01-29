import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
function Search() {
  const [data,setData]=useState("");
  const navigate=useNavigate();
  const handleSubmit=()=>{
    console.log(data);
    if(data.length>0){
      navigate(`/search/${data}`)
    }
  }
  return (
    <div className="focus:bg-gray-100  relative w-full md:w-96 bg-white border border-gray-300 rounded-full shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 ">
      <input
        type="text"
        value={data}
        onChange={(e)=>setData(e.target.value)}
        placeholder="Search for anything..."
        className="w-full py-3 pl-6 pr-12 text-gray-700 placeholder-gray-400 bg-transparent rounded-full focus:outline-none transition duration-300 ease-in-out"
      />
      <FaSearch onClick={handleSubmit} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-500 transition duration-200 ease-in-out" />
    </div>
  );
}

export default Search;
