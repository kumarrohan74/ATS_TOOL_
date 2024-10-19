import { useState, createContext } from "react";

export const CandidateContext = createContext();

export const DataProvider = ({ children }) => {
    const [isJDChecked, setIsJDChecked] = useState(false);
    const [applied_position, setApplied_position] = useState('');
    const [application_status, setApplication_status] = useState('');
    const [positions, setPositions] = useState([
        'Software Engineer',
        'DevOps Engineer',
        'Data Scientist',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Cybersecurity Analyst',
        'Cloud Engineer',
        'Database Administrator',
        'IT Project Manager',
        'Network Engineer',
        'Systems Analyst',
        'QA Tester',
        'Technical Support Specialist',
        'IT Consultant',
        'Machine Learning Engineer',
        'UI/UX Designer',
        'Solutions Architect',
        'Scrum Master',
        'Mobile App Developer'
    ]);
    const [applicant_status, setApplicant_status] = useState([
        "Profile Added",
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Interview Completed",
        "Offer Extended",
        "Offer Accepted",
        "Offer Declined",
        "Rejected",
        "On Hold",
        "Hired",
        "Withdrawn"
    ]);
    /*  const [data, setData] = useState('');
      const apiURI = process.env.REACT_APP_API_URL;
      const [loader, setLoader] = useState(true);
      const endpoint = "/get-candidates"
      
      useEffect(() => {
          fetch(`${apiURI}${endpoint}`)
              .then(res => res.json())
              .then(response => {
                  setData(response);
                  setLoader(!loader);
              })
              .catch(err => console.error(err))
      }, [apiURI]);*/
    return (
        <CandidateContext.Provider value={{ isJDChecked, setIsJDChecked, applied_position, setApplied_position, positions, setPositions, application_status, setApplication_status, applicant_status, setApplicant_status }}>
            {children}
        </CandidateContext.Provider>)
}

