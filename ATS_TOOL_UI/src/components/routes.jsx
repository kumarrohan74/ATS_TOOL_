import { Routes, Route } from 'react-router-dom';
import Candidatelist from './Candidatelist';
export function Router() {

    return (
        <Routes>
            <Route path='/candidatelist' element={<Candidatelist />} />
        </Routes>

    )
}
