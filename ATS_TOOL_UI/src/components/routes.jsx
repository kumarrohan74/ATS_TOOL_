import { Routes, Route, Navigate } from 'react-router-dom';
import Candidatelist from './Candidatelist';
import AddProfile from './AddProfile';
import CandidateProfile from './CandidateProfile';
import { END_POINTS } from './Constants';
export function Router() {
    const { CANDIDATE,
        CANDIDATE_LIST,
        ADD_PROFILE } = END_POINTS;
    return (
        <Routes>
            <Route path="/" element={<Navigate to={CANDIDATE_LIST} />} />
            <Route path= {CANDIDATE_LIST} element={<Candidatelist />} />
            <Route path={`${CANDIDATE}/:id`} element={<CandidateProfile />} />
            <Route path={ADD_PROFILE} element={<AddProfile />} />
        </Routes>

    )
}

