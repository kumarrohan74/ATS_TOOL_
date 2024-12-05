import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { END_POINTS } from "../Constants";
const {CANDIDATE_LIST,ADD_PROFILE} = END_POINTS
const Sidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname)

  useEffect(() => {
    if (location.pathname === "/") {
      setActivePath(CANDIDATE_LIST)
    }
    else {
      setActivePath(location.pathname)
    }
  },[location.pathname])

  const handleClick = (e) => {
    if (e.target.id === 'candidatelist') {
      navigate(CANDIDATE_LIST)
      setActivePath(CANDIDATE_LIST)
    }
    if (e.target.id === 'addProfile') {
      navigate(ADD_PROFILE)
      setActivePath(ADD_PROFILE)
    }
    if (e.target.id === 'atsMatch') {
      navigate('/atsMatch')
      setActivePath('/atsMatch')
    }
  }

  return (
    <div className="w-[250px] relative border-0 shadow-lg shadow-right bg-gray-100 flex-shrink-0">
      <ul className="h-screen">
        <li className={` p-4 pl-0 cursor-pointer text-center text-gray-700 font-bold hover:bg-indigo-100 hover:text-indigo-600 ${activePath === '/candidatelist' ? 'text-indigo-600 bg-indigo-100' : ''}`} id='candidatelist' onClick={(e) => handleClick(e)}>Candidate list</li>
        <li className={` p-4 pl-0 text-center text-gray-700  text-base cursor-pointer font-bold hover:bg-indigo-100 hover:text-indigo-600 ${activePath === '/addprofile' ? 'text-indigo-600 bg-indigo-100' : ''}`} id='addProfile' onClick={(e) => handleClick(e)}>Upload Profile</li>
        <li className={`mb-3 p-4 pl-0 text-center text-gray-700  text-base cursor-pointer font-bold hover:bg-indigo-100 hover:text-indigo-600 ${activePath === '/atsMatch' ? 'text-indigo-600 bg-indigo-100' : ''}`} id='atsMatch' onClick={(e) => handleClick(e)}>ATS Match</li>
      </ul>
    </div>

  )
}

export default Sidebar;

