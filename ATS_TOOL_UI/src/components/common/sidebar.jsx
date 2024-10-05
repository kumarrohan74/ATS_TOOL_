import React from "react";

const Sidebar = () => {
    return (
        <div className="w-[250px] border-0 shadow-lg shadow-right h-screen bg-gray-100">
          <ul>
            <li className="p-4 pl-0 cursor-pointer text-center text-gray-700 font-bold hover:bg-indigo-100 hover:text-indigo-600">Candidate list</li>
            <li className='mb-3 p-4 pl-0 text-center text-gray-700  text-base cursor-pointer font-bold hover:bg-indigo-100 hover:text-indigo-600'>Add profile</li>
          </ul>
            
        </div>
       
    )
}

export default Sidebar;

