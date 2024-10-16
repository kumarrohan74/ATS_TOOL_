import { useLocation } from "react-router-dom";
import ATSScoreCard from "./ATSScoreCard";
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CircularLoader from '../utils/Loader';

export default function CandidateProfile() {

  const location = useLocation();
  const list = location.state?.candidate;
  const skills = list?.skills || [];

  return (<>
    <div className="bg-slate-50 w-screen min-h-screen p-6">
      <div class="flex flex-wrap w-full">
        <div class="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 m-2 my-4 p-6 flex">
          <div class="flex-shrink-0">
            <img class="w-32 h-32 rounded-full object-cover" src="https://via.placeholder.com/150" alt="Candidate Photo" />
          </div>
          <div class="ml-6">
            <h2 class="font-bold text-2xl">{list?.name}</h2>
            <p class="text-gray-700 text-lg">{list?.category}</p>
            <p class="text-gray-500 text-base">ABC Company Pvt.Ltd.</p>
            <p class="text-gray-500 text-base">{list?.education}</p>
          </div>
          <div className="ml-14">
            <ATSScoreCard score={list?.ats_score} />
          </div>
          <div className="ml-auto">
            <p className="text-gray-600 text-lg"><strong><MailIcon /></strong> {list?.email}</p>
            <p className="text-gray-600 text-lg"><strong><LocalPhoneIcon /></strong> {list?.phone_number}</p>
            <p className="text-gray-600 text-lg"><strong><LocationOnIcon /></strong> {list?.location}</p>
            <p className="text-gray-600 text-lg"><strong><PictureAsPdfIcon /><a href={list?.resume_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline ml-1">View Resume</a></strong> </p>
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
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[100px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-indigo-800">{list?.status}</h3>
            </div>
          </div>
        </div>
        <div className="w-2/3 px-2">
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">Candidate's Description</h3>
            <p className="text-lg text-gray-700">
              {list?.description || "No description available for this candidate."}
            </p>
          </div>
        </div>
      </div>
    </div>
  </>)
}