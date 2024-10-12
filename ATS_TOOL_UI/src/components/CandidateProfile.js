import { useLocation } from "react-router-dom"

export default function CandidateProfile(){
   
    const location = useLocation();
    console.log(location)
    return (<>CandidateProfile</>)
}