import { Routes, Route, Navigate } from 'react-router-dom';
import Candidatelist from './Candidatelist';
import AddProfile from './AddProfile';
import CandidateProfile from './CandidateProfile';
export function Router() {

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/candidatelist" />} />
            <Route path='/candidatelist' element={<Candidatelist />} />
            <Route path='/candidate/:id' element={<CandidateProfile />} />
            <Route path='/addprofile' element={<AddProfile />} />
        </Routes>

    )
}
