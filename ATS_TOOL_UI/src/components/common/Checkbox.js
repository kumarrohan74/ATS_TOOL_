import React, { useContext } from 'react';
import { CandidateContext } from '../Context';

function ToggleSwitch(props) {
    const {isJDCheck, setIsJDChecked} = useContext(CandidateContext);
    const {isToggled, setToggle,action} =props;
    // Handle the toggle switch
    const handleToggle = () => {
        if(props.value==="not_checked"){
            setIsJDChecked(false)
           }
        setToggle(!isToggled);
        if(props.setAction){
            props.setAction(isToggled);
        }
      
       
};
    return (
        <label className="relative inline-flex items-center cursor-pointer select-none">
            {/* Hidden Checkbox */}
            <input
                type="checkbox"
                checked={isToggled}
                onChange={handleToggle}
                className="sr-only peer"
            />

            {/* Slider Background */}
            <div
                className={`w-14 h-8 rounded-full transition-all duration-300
                ${isToggled ? 'bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-500' : 'bg-gray-300'}`}
            ></div>

            {/* Circle (Thumb) */}
            <div
                className={`absolute left-1  w-6 h-6 bg-white border-2 border-gray-300 rounded-full 
                transition-transform duration-300 ease-in-out shadow-lg
                ${isToggled ? 'translate-x-6' : ''}`}
            ></div>
        </label>
    );
}

export default ToggleSwitch;
