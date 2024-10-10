import { Routes, Route } from 'react-router-dom';
import Candidatelist from './Candidatelist';
import AddProfile from './AddProfile';
export function Router() {

    return (
        <Routes>
            <Route path='/candidatelist' element={<Candidatelist />} />
            <Route path='/addprofile' element={<AddProfile />} />
        </Routes>

    )
}
