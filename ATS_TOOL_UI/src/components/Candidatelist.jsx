
import * as React from 'react';
import { CandidateContext } from './Context';
import DataTable from './Datagrid';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Full Name',
        width: 160,
    },
    {
        field: 'email',
        headerName: 'Email',
        sortable: false,
        width: 160,
    },
    {
        field: 'applied_position',
        headerName: 'Applied Position',
        width: 150,
    },
    {
        field: 'ats_score',
        headerName: 'ATS Score',
    },
    {
        field: 'location',
        headerName: 'Location',
        width: 140,
    },
    {
        field: 'status',
        headerName: 'Application Status',
        width: 160,
    },
    {
        field: 'experience',
        headerName: 'Experience',
        type: 'number',
        width: 120,
    },
];

function Candidatelist() {
    const { data } = React.useContext(CandidateContext);
    const candidates = data.candidates;
    let rows;
    if (candidates) {
        rows = candidates.map((details) =>{
             return { id: details?._id, name: details?.name, email: details?.email, ats_score: details?.ats_score, applied_position: details?.applied_position,
                location: details?.location, status: details?.status, experience: details?.experience
        }
     } )
    }
    return (
    <div className='m-8 w-full'>
            <DataTable columns={columns} rows={rows} />
       </div>
    );
}


export default Candidatelist;