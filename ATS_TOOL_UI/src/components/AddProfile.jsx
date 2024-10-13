import { useState } from "react";
import UploadModal from "./Modal";
import axios from "axios";
import { SettingsCellRounded } from "@mui/icons-material";

function AddProfile() {

  const [isOpen, setIsOpen] = useState(false)
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score,setScore] = useState();

  const apiURI = process.env.REACT_APP_API_URL;
  const endpoint = '/resume-upload';

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!resume || !jobDescription) {
  //     alert('Please upload pdf file');
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("resume", resume);
  //   formData.append("jobDescription", jobDescription);
  //   setIsOpen(true)
  //   console.log(jobDescription)
  //   console.log(resume)

  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      alert('Please upload pdf file');
      return;
    }
    const formData = new FormData();
    console.log(resume)
    console.log(jobDescription)
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(`${apiURI}${endpoint}`, formData);
      setIsOpen(true);
      setScore(Math.round(response.data.atsScore));
     
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };


  console.log(score)

  const closeModal = () => setIsOpen(false)
  return (<>
    { isOpen && <UploadModal value={{ isOpen, closeModal, score }} /> }
    {/* <form onSubmit={handleSubmit} className="h-screen w-screen flex justify-between items-center space-y-6 bg-slate-100"> */}
      <div className="w-full h-screen mt-4">
        {/* Job Description */}
        <label
          className="block ml-11 pl-1 mb-1 text-lg font-bold text-gray-700"
          htmlFor="file_input"
        >
          Job Description:
        </label>

        <textarea
          id="textarea"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="border border-gray-300 ml-11  rounded-lg p-2 w-11/12 h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 placeholder-gray-500 bg-zinc-50"
          placeholder="Write job description here"
        />

        {/* File Upload */}
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
          className="hidden"
        />

        {/* Custom file input box */}
        <label
          htmlFor="fileUpload"
          className="border-2 border-dashed border-gray-400 p-6 w-11/12  text-center font-medium rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-200 transition duration-300 block ml-11  mt-3 mb-2 text-lg font-medium text-gray-700"
        >
          {resume ? resume.name : "Upload Resume"} {/* Display the file name or "Upload Resume" */}
        </label>
        <button
          onClick={handleSubmit}
          className=" float-end mr-[62px] bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none  transition duration-300 cursor-pointer"
        >
          Upload
        </button>
      </div>
    {/* </form> */}
  </>)
}
export default AddProfile;
