import { useState } from "react";
import axios from "axios";
import UploadModal from "./Modal";


function AddProfile() {

  const [isOpen, setIsOpen] = useState(false)
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState();
  const [candidateId, setCandidateId] = useState('')

  const apiURI = process.env.REACT_APP_API_URL;
  const endpoint = '/resume-upload';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      alert('Please upload pdf file');
      return;
    }
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(`${apiURI}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsOpen(true);
      setScore(Math.round(response.data.atsScore));
      setCandidateId(response.data.id);

    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const closeModal = () => setIsOpen(false)
  return (
    <>
      {isOpen && <UploadModal value={{ isOpen, closeModal, score, candidateId }} />}
      <div className="w-full h-screen mt-4">
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
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
          className="hidden"
          name="resume"
        />
        <label
          htmlFor="fileUpload"
          className="border-2 border-dashed border-gray-400 p-6 w-11/12  text-center font-medium rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-200 transition duration-300 block ml-11  mt-3 mb-2 text-lg font-medium text-gray-700"
        >
          {resume ? resume.name : "Upload Resume"}
        </label>
        <button
          onClick={handleSubmit}
          className=" float-end mr-[62px] bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none  transition duration-300 cursor-pointer"
        >
          Upload
        </button>
      </div>
    </>)
}

export default AddProfile;
