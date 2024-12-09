import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import ATSScoreCard from "./ATSScoreCard";
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CircularLoader from './common/Loader';
import { API_URI, END_POINTS, ALERTS } from './Constants';
import Dropdown from './Dropdown';
import { Button } from '@mui/material';
import { CandidateContext } from './Context';
import axios from 'axios';

export default function CandidateProfile() {
  const { application_status, applied_position, isEditRemarksOpen, setIsEditRemarksOpen } = useContext(CandidateContext);
  const [isStatusClose, setIsStatusClose] = useState(true);
  const [statusLoader, setStatusLoader] = useState(false);
  const [roleLoader, setRoleLoader] = useState(false);
  const [remarksLoader, setRemarksLoader] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state.candidate;
  const [candidate, setCandidate] = useState(data);
  const [isRoleClose, setIsRoleClose] = useState(true)
  const skills = candidate?.skills || [];
  const [status, setStatus] = useState(candidate?.status);
  const [role, setRole] = useState(candidate?.applied_position);
  const [isRemarksOpen, setIsRemarksOpen] = useState('');
  const [resume, setResume] = useState(candidate?.resume);
  const [formValue, setFormValue] = useState(candidate.remarks || '');
  const handleClose = (e) => {
    if (e.target.id === "changeStatus") {
      console.log(e.target.value)
      setIsStatusClose(false);
    }
    if (e.target.id === "changeRole") {
      setIsRoleClose(false);
    }
  }

  const handleStatusClick = async (e) => {

    e.stopPropagation();
    e.preventDefault();
    const actions = {
      changeStatus: { key: 'status', value: application_status },
      changeRole: { key: 'applied_position', value: applied_position },
      remarks: { key: 'remarks', value: formValue }
    };
    const action = actions[e.target.id];
    const { key, value } = action;

    if (key === "status") setStatusLoader(true)
    if (key === "applied_position") setRoleLoader(true)
    if (key === "remarks") setRemarksLoader(true);
    try {
      axios.patch(`${API_URI}${END_POINTS.CANDIDATE}/${candidate._id}/?key=${key}&value=${value}`,
        {
          id: candidate._id
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, value })
        }).then(response => {
          if (e.target.id === 'changeStatus') {
            setStatus(response.data.status);
            setStatusLoader(false)

          }
          if (e.target.id === 'changeRole') {
            setRole(response.data.applied_position);
            setRoleLoader(false)
          }
          if (e.target.id === "remarks") {
            setIsEditRemarksOpen(false);
            setRemarksLoader(false)
          }
          navigate(`${END_POINTS.CANDIDATE}/${response.data.updatedData._id}`, { state: { candidate: response.data.updatedData } });

        });
    }
    catch (e) {
      console.log('error edit', e);
    }
    if (e.target.id === "changeStatus") {
      setIsStatusClose(true);
      return;
    }
    if (e.target.id === "changeRole") {
      setIsRoleClose(true);
      return;
    }

  }
  const handleDropdownClose = (e) => {
    if (e.target.id === "changeRole") {
      setIsRoleClose(true)
    }
    if (e.target.id === "changeStatus") {
      setIsStatusClose(true)
    }
  }

  const downloadFile = async () => {
    try {
      const response = await fetch(`${API_URI}/download/${candidate._id}`);
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.resumeName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the resume:", error);
    }
  }
  const handleCancelRemarks = () => {
    setFormValue(candidate.remarks);
    setIsEditRemarksOpen(false)
  }

  return (<>
    <div className="bg-slate-50 w-screen min-h-screen p-6">
      <div className="flex flex-wrap w-full">
        <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 m-2 my-4 p-6 flex">
          <div className="flex-shrink-0">
            <img className="w-32 h-32 rounded-full object-cover" src="https://via.placeholder.com/150" alt="Candidate Photo" />
          </div>
          <div className="ml-6">
            <h2 className="font-bold text-2xl">{candidate?.name}</h2>
            <p className="text-gray-700 text-sm"><span  className="text-gray-700 text-lg">Candidate ID: </span>{candidate?._id}</p>
            <p className="text-gray-700 text-lg">{candidate?.category}</p>
            <p className="text-gray-500 text-base">ABC Company Pvt.Ltd.</p>
            <p className="text-gray-500 text-base">{candidate?.education}</p>
            <p className="text-gray-500 text-base">Exp: {candidate?.experience.totalYears}+ years</p>

          </div>
          <div className="ml-auto">
            <div className='flex gap-4'>
              <div className="text-gray-600 text-lg w-auto"><strong><MailIcon /></strong> </div><div>{candidate?.email}</div>
            </div>
            <div className='flex gap-4'>
              <div className="text-gray-600 text-lg w-auto"><strong><LocalPhoneIcon /></strong> </div><div>{candidate?.phone_number}</div>
            </div>
            <div className='flex gap-4'>
              <div className="text-gray-600 text-lg w-auto"><strong><LocationOnIcon /></strong> </div><div>{candidate?.location}</div>
            </div>
            <div className='flex gap-4'>
              <div className="text-gray-600 text-lg"><strong><PictureAsPdfIcon /></strong></div>
              <div className='cursor-pointer'><p className="text-blue-600 text-underline" onClick={downloadFile}>
                <strong>{resume?.resumeName}</strong>
              </p> </div>
              </div>
            </div>
          </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-1/3 px-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <h3 className="text-2xl font-bold text-center text-indigo-800 mb-4">Skills</h3>
            <div className="flex flex-wrap justify-center">
              {skills?.map((skill, index) => (
                <span key={index} className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-sm font-semibold text-indigo-600 mr-2 mb-2">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center w-full max-w-md">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4 text-indigo-800">
                Role:
                <span className="text-md font-bold text-indigo-700">
                  {roleLoader ? <CircularLoader size={1} thickness={1} /> : role}
                </span>
              </h3>
              <h3 className="text-lg font-bold mb-4 text-indigo-800">
                Status:
                <span className="text-md font-bold text-indigo-700">
                  {statusLoader ? <CircularLoader size={1} thickness={1} /> : status}
                </span>
              </h3>

              <div className="flex justify-center items-center space-x-4">
                <div hidden={!isRoleClose}>
                  {isStatusClose ? (
                    <Button value="changeStatus" variant="outlined" onClick={handleClose} id="changeStatus">
                      Edit status
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Dropdown dropdown="applicantStatus" />
                      <Button variant="contained" color="primary" className="w-20" onClick={handleStatusClick} value="changeStatus" id="changeStatus">
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" className="w-20" onClick={handleDropdownClose} id="changeStatus">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div hidden={!isStatusClose}>
                  {isRoleClose ? (
                    <Button value="changeRole" variant="outlined" onClick={handleClose} id="changeRole">
                      Change Role
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Dropdown dropdown="addProfile" />
                      <Button variant="contained" color="primary" className="w-20" onClick={handleStatusClick} value="changeRole" id="changeRole">
                        Save
                      </Button>
                      <Button variant="outlined" color='secondary' className="w-20" onClick={handleDropdownClose} id="changeRole">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="w-2/3 px-2">
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">Candidate's Description</h3>
            <p className="text-lg text-gray-700">
              {candidate?.candidateDescription}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg mt-2 p-6 h-auto">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800 item-center">Remarks:</h3>
            {
              !candidate.remarks || isEditRemarksOpen
                ? <form onSubmit={handleStatusClick} className=" w-full min-h-[50px] relative" id="remarks">
                  <textarea class="bg-gray-200  focus:bg-white p-1 mr-2 rounded w-full " rows={4} type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                  <div className='flex justify-end mt-2 space-x-2'> <Button variant="contained" type="submit" className='bg-blue-500 text-white font-bold  rounded'>Save</Button>
                    <Button variant="text" className='mb-4 font-bold text-red-800 rounded border hover:bg-gray-300 ml-2' onClick={handleCancelRemarks}>Cancel</Button>
                  </div> </form>
                : <p className="mr-4 text-md text-gray-500 font-bold">
                  {formValue} <span className="cursor-pointer text-blue-600 text-sm ml-2 underline" onClick={() => setIsEditRemarksOpen(true)}>edit remarks</span>
                </p>
            }
          </div>
        </div>
      </div>
    </div>
  </>)
}