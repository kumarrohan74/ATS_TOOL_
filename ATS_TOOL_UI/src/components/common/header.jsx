import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Button from '@mui/material/Button';
import { getInitials } from "../../utils/getName";
import { END_POINTS } from "../Constants";
const { CANDIDATE_LIST } = END_POINTS

const Header = ({ userInfo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleHome = () => {
        window.location.href = CANDIDATE_LIST;
    }
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsOpen(false);
        window.location.href = '/';
    };
    const Logout = () => {
        return (
            <div ref={ref} className="absolute right-2 mt-[54px] w-48 p-4 border rounded shadow-lg bg-white z-10">
                <Button
                    onClick={handleLogout}
                    className="w-full"
                >
                    Logout
                </Button>
            </div>
        )
    }
    return (
        userInfo?.name && (
            <div className="flex h-[60px] cursor-pointer bg-indigo-600 hover:bg-indigo-500 justify-between items-center bg-gray-100 p-4">
                <div onClick={handleHome}>
                    <h1 className="text-white text-4xl p-2 w-full">
                        ATS
                    </h1>
                </div>
                <div className="flex">
                    {userInfo.picture ? (
                        <>
                            <p className="mt-2 mr-2 text-xl font-semibold text-white">{userInfo?.name}</p>
                            <img className="w-12 h-12 rounded-full" src={userInfo?.picture} onClick={() => setIsOpen(!isOpen)} />
                            {isOpen && (<Logout />)}

                        </>
                    ) : <h1 className="w-12 h-12 rounded-full border flex items-center justify-center bg-white">
                        <p className="ml-4 text-lg font-semibold" onClick={() => setIsOpen(!isOpen)} >{userInfo?.name}</p> {getInitials(userInfo?.name)}
                        {isOpen && (<Logout />)}
                    </h1>}
                </div>
            </div>
        )
    )
}

export default Header