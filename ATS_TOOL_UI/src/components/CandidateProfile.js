import { useState } from "react";
import { useLocation } from "react-router-dom";
import Dropdown from "./Dropdown";
const data = {
    "_id": "6706be69fa15d580d4bb5683",
    "id": "ObjectId('60c72b2f009e7e4c3d8f9f5125')",
    "name": "David Lee",
    "email": "david.lee@mail.com",
    "phone_number": "+1-833-569-3205",
    "resume_url": "https://s3.amazonaws.com/resumes/davidlee.pdf",
    "ats_score": 91,
    "skills": [
        "JavaScript",
        "React",
        "Node.js",
        "PostgreSQL"
    ],
    "experience": 7,
    "education": "Master's in Computer Science",
    "applied_position": "Frontend Developer",
    "date_applied": "2023-10-15T11:15:20.789123",
    "location": "Berlin/Germany",
    "status": "Offer Extended",
    "category": "Frontend developer",
    "comments": "Exceptional frontend skills"
}
export default function CandidateProfile(){
    const jObj = JSON.stringify(data);
   const [list,setList] = useState(JSON.parse(jObj));
    const location = useLocation();
   
    console.log(list);
    return (<>
   <div className="bg-slate-50 w-screen min-h-screen p-6">
  {/* Candidate's Name, Experience, Performance Score, and Domain */}
  <div className="flex items-center m-3 mb-6 bg-indigo-200 rounded-lg shadow-lg h-[80px] justify-around px-6">
    <div className="w-1/6">
      <h6 className="text-xl font-semibold text-indigo-800">
        <span className="font-bold">Name:</span> {list.name}
      </h6>
    </div>
    <div className="w-1/6">
      <h4 className="text-lg font-bold text-indigo-800">
        <span className="font-semibold">Experience:</span> {list.experience} yrs
      </h4>
    </div>
    <div className="w-1/6">
      <h4 className="text-xl font-bold text-indigo-900 pr-4"><span className="font-semibold">Performance:</span>  {list.ats_score}%</h4>
    </div>
    <div className="w-1/6">
      <h4 className="text-md font-bold text-indigo-800">
        <span className="font-semibold">Domain:</span> {list.category}
      </h4>
    </div>
    <div className="w-1/6">
      <Dropdown />
    </div>
  </div>

  {/* Candidate's Details, Skills, Description */}
  <div className="grid gap-6 grid-cols-12 mt-8">
    {/* Candidate's Skills and Contact Details */}
    <div className="col-span-4">
      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold text-center text-indigo-800 mb-4">Skills</h3>
        <div className="flex flex-wrap justify-center">
          {list.skills.map((skill, index) => (
            <span key={index} className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-sm font-semibold text-indigo-600 mr-2 mb-2">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center text-indigo-800 mb-4">Contact Details</h3>
        <div className="space-y-3 text-gray-700">
          <div><strong>Phone:</strong> {list.phone_number}</div>
          <div><strong>Email:</strong> {list.email}</div>
          <div><strong>Education:</strong> {list.education}</div>
          <div><strong>Location:</strong> {list.location}</div>
          <div><strong>Resume:</strong> 
            <a href={list.resume_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Click here</a>
          </div>
          <div><strong>Applied:</strong> {list.date_applied}</div>
        </div>
      </div>
    </div>

    {/* Candidate's Description */}
    <div className="col-span-8 bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
      <h3 className="text-2xl font-bold mb-4 text-indigo-800">Candidate's Description</h3>
      <p className="text-lg text-gray-700">
        {list.description || "No description available for this candidate."}
      </p>
    </div>
  </div>
</div>


    
    </>)
}