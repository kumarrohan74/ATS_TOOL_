import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/candidatelist')
        if (location.pathname === '/candidatelist') {
            location.state({ active: true });
        }
    }



    return (
        <div className="w-[250px] relative border-0 shadow-lg shadow-right h-screen bg-gray-100 flex-shrink-0">
            <ul>
                <li className={` p-4 pl-0 cursor-pointer text-center text-gray-700 font-bold hover:bg-indigo-100 hover:text-indigo-600 ${location.pathname === '/candidatelist' ? 'active:bg-gray-500' : ''}`} onClick={handleClick}>Candidate list</li>
                <li className='mb-3 p-4 pl-0 text-center text-gray-700  text-base cursor-pointer font-bold hover:bg-indigo-100 hover:text-indigo-600'>Add profile</li>
            </ul>

        </div>

    )
}

export default Sidebar;

