import { useState } from "react";
import UploadModal from "./Modal";
function AddProfile() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !text) {
      alert('Please upload pdf file');
      return;
    }

    setIsOpen(true)
    console.log(text)
    console.log(file)

  }
  const closeModal = () => setIsOpen(false)
  return (<>
    { isOpen && <UploadModal value={{ isOpen, closeModal }} /> }
    <form onSubmit={handleSubmit} className="h-screen w-screen flex justify-between items-center space-y-6 bg-slate-100">
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 ml-11  rounded-lg p-2 w-11/12 h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 placeholder-gray-500 bg-zinc-50"
          placeholder="Write job description here"
        />

        {/* File Upload */}
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {/* Custom file input box */}
        <label
          htmlFor="fileUpload"
          className="border-2 border-dashed border-gray-400 p-6 w-11/12  text-center font-medium rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-200 transition duration-300 block ml-11  mt-3 mb-2 text-lg font-medium text-gray-700"
        >
          {file ? file.name : "Upload Resume"} {/* Display the file name or "Upload Resume" */}
        </label>
        <button
          type="submit"
          className=" float-end mr-[62px] bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg shadow-md hover:bg-indigo-800 focus:outline-none  transition duration-300 cursor-pointer"
        >
          Upload
        </button>
      </div>
    </form>
  </>)
}
export default AddProfile;
