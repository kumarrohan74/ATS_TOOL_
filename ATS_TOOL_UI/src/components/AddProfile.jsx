import React, { useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dropdown from "./Dropdown";
import ToggleSwitch from "./common/Checkbox";
import { CandidateContext } from "./Context";
import UploadModal from "./Modal";
import { ALERTS, API_URI, END_POINTS } from "./Constants";

function AddProfile() {

  const [isOpen, setIsOpen] = useState(false)
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState(0);
  const [candidateId, setCandidateId] = useState('')
  const { isJDChecked, applied_position,application_status } = React.useContext(CandidateContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
      formData.append("application_status", "Profile Added");
    formData.append("resume", resume);
    formData.append("applied_position", applied_position);
    if (isJDChecked) {
      formData.append("jobDescription", jobDescription);
    }
    try {
      const response = await axios.post(`${API_URI}${END_POINTS.UPLOAD_RESUME}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (isJDChecked) {
        setScore(Math.round(response.data.atsScore));
      }
      setCandidateId(response.data._id);
      setIsOpen(true);
    } catch (error) {
      console.error(ALERTS.ERROR_UPLOAD, error);
    }
  };
  const closeModal = () => setIsOpen(false)

  return (
    <>
      {isOpen && <UploadModal value={{ isOpen, closeModal, score, candidateId, isJDChecked }} />}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full h-screen mt-4">
          <div className="w-full ml-10">
            <div className="flex justify-between w-11/12">
              <label
                className="text-lg font-bold text-gray-700"
                htmlFor="file_input"
              >
                Job Description:
              </label>
              <div className="flex font-bold text-gray-700 ">
                <h3 className=" mr-2 text-lg ">Check Ats Score:</h3>
                <ToggleSwitch />
              </div>
            </div>
            <textarea
              id="textarea"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className={`border border-gray-300 mt-2 rounded-lg w-11/12  pl-2
                        h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        transition duration-300 placeholder-gray-500 bg-zinc-50 
                        ${!isJDChecked ? "cursor-not-allowed bg-gray-100 opacity-30" : ""} `}
              placeholder="Write your job description here"
              required={isJDChecked}
              disabled={!isJDChecked} />
          </div>
          <div className="w-full ml-10 my-2">
            <input
              id="fileUpload"
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
              name="resume"
              required />
            <label
              htmlFor="fileUpload"
              className="border-2 border-dashed border-gray-400 p-6 w-11/12  text-center font-medium rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-200 transition duration-300 block text-lg font-medium text-gray-700"
              required>
              {resume ? resume.name : "Upload Resume"}
            </label>
          </div>
          <div className="w-11/12 flex justify-end ml-10">
            <div className="mr-4">
              <Dropdown dropdown="addProfile" disabled={isJDChecked ? true : false}/>
            </div>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#4f46e5',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3730a3',
                },
              }}
              startIcon={<CloudUploadIcon />}
              disabled={!resume ? true : false}
            >
             {isJDChecked ? `Check ATS Score` : `Upload`}
            </Button>
          </div>
        </div>
      </form>
    </>)
}

export default AddProfile;
