import React from "react";

const Sidebar = () => {
    return (
        <div className="w-[250px] border-r-2 border-sky-500 h-screen ">
          <ul>
            <li className="p-4 pl-0 hover:bg-gray-200 hover:text-stone-700 cursor-pointer text-center">Candidate list</li>
            <li className='mb-3 p-4 pl-0 text-center text-base hover:bg-gray-200 hover:text-stone-700 cursor-pointer'>Add profile</li>
          </ul>
            
        </div>
       
    )
}

export default Sidebar;

