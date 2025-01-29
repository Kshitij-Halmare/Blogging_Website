import React, { useContext } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { EditorContext } from '../../Pages/Editor/EditorPage';

function Tags({ tag, index }) {
  const { setBlog } = useContext(EditorContext);

  const handleDelete = () => {
    // Update tags by filtering out the selected tag
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index), // Remove tag by index
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="border flex items-center gap-2 border-gray-300 hover:border-gray-500 bg-white px-3 py-1 rounded-full shadow-md transition duration-200 ease-in-out">
        <span className="text-gray-800 font-semibold">{tag}</span>
        <FaTimesCircle
          onClick={handleDelete}
          className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200"
          title="Remove Tag"
        />
      </div>
    </div>
  );
}

export default Tags;
