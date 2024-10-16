import { useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
      <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full h-screen mt-4">
        <div className="w-full ml-10">
          <label
            className="text-lg font-bold text-gray-700"
            htmlFor="file_input"
          >
            Job Description:
          </label>
          <textarea
            id="textarea"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="border border-gray-300 rounded-lg w-11/12 h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 placeholder-gray-500 bg-zinc-50"
            placeholder="Write your job description here"
          />
        </div>
        <div className="w-full ml-10 my-2">
          <input
            id="fileUpload"
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            className="hidden"
            name="resume"
          />
          <label
            htmlFor="fileUpload"
            className="border-2 border-dashed border-gray-400 p-6 w-11/12  text-center font-medium rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-200 transition duration-300 block text-lg font-medium text-gray-700"
          >
            {resume ? resume.name : "Upload Resume"}
          </label>
        </div>
        <div className="w-11/12 flex justify-end ml-10">
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
            // onClick={handleSubmit}
          >
            Upload
          </Button>
        </div>
      </div>
      </form>
    </>)
}

export default AddProfile;
