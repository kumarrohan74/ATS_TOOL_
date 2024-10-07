import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname)
  const handleClick = () => {
    navigate('/candidatelist')
    setActivePath('/candidatelist')
  }

  return (
    <div className="w-[250px] relative border-0 shadow-lg shadow-right h-screen bg-gray-100 flex-shrink-0">
      <ul>
        <li className={` p-4 pl-0 cursor-pointer text-center text-gray-700 font-bold hover:bg-indigo-100 hover:text-indigo-600 ${activePath === '/candidatelist' ? 'text-indigo-600 bg-indigo-100' : ''}`} onClick={handleClick}>Candidate list</li>
        <li className='mb-3 p-4 pl-0 text-center text-gray-700  text-base cursor-pointer font-bold hover:bg-indigo-100 hover:text-indigo-600'>Add profile</li>
      </ul>

    </div>

  )
}

export default Sidebar;

