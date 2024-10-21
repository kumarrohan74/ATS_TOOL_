import { useContext, useState } from 'react';
import { useLocation } from "react-router-dom";
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
  const { application_status } = useContext(CandidateContext)
  const [isClose, setIsClose] = useState(true);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const list = location.state?.candidate;
  const skills = list?.skills || [];
  const [status, setStatus] = useState(list?.status)
  const [resume, setResume] = useState(list?.resume);
  const handleClose = () => {
    setIsClose(false);
  }
  const handleStatusClick = async () => {
    setLoader(true);
    try {
      axios.patch(`${API_URI}${END_POINTS.CANDIDATE}/${list._id}`, {
        status: application_status,
        id: list._id
      },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(result => {
          setStatus(result.data.status)
          setLoader(false)
        })
    }
    catch (e) {
      console.log('error edit', e);
    }
    setIsClose(true);
  }


  const downloadFile = async () => {
    try {
      const response = await fetch(`${API_URI}/download/${list._id}`);
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
  return (<>
    <div className="bg-slate-50 w-screen min-h-screen p-6">
      <div className="flex flex-wrap w-full">
        <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 m-2 my-4 p-6 flex">
          <div className="flex-shrink-0">
            <img className="w-32 h-32 rounded-full object-cover" src="https://via.placeholder.com/150" alt="Candidate Photo" />
          </div>
          <div className="ml-6">
            <h2 className="font-bold text-2xl">{list?.name}</h2>
            <p className="text-gray-700 text-lg">{list?.category}</p>
            <p className="text-gray-500 text-base">ABC Company Pvt.Ltd.</p>
            <p className="text-gray-500 text-base">{list?.education}</p>
          </div>
          <div className="ml-14">
            <ATSScoreCard score={list?.ats_score} />
          </div>
          <div className="ml-auto">
            <p className="text-gray-600 text-lg"><strong><MailIcon /></strong> {list?.email}</p>
            <p className="text-gray-600 text-lg"><strong><LocalPhoneIcon /></strong> {list?.phone_number}</p>
            <p className="text-gray-600 text-lg"><strong><LocationOnIcon /></strong> {list?.location}</p>
            <p className="text-gray-600 text-lg"><strong><PictureAsPdfIcon /><p className="text-blue-600 text-underline" onClick={downloadFile}>
              {resume?.resumeName}
            </p></strong> </p>
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
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-auto w-auto flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4 text-indigo-800">Role:<span className='text-md font-bold text-indigo-700'> {list?.applied_position}</span></h3>
              <h3 className="text-lg font-bold mb-4 text-indigo-800">Status:<span className='text-md font-bold text-indigo-700'> {loader ? <CircularLoader size={1} thickness={1} /> : status}</span></h3>
              {isClose ? <Button variant='outlined' onClick={handleClose}>Edit status</Button>
                : <div className='flex justify-around w-auto'><Dropdown dropdown="applicantStatus" /><Button variant='contained' className='w-auto' onClick={handleStatusClick}>save</Button></div>
              }
            </div>
          </div>
        </div>
        <div className="w-2/3 px-2">
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">Candidate's Description</h3>
            <p className="text-lg text-gray-700">
              {list?.description || ALERTS.NO_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>
    </div>
  </>)
}