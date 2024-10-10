
import * as React from 'react';
import { CandidateContext } from './Context';
import DataTable from './Datagrid';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Full Name',
        width: 160,
        editable: true,
    },

    {
        field: 'email',
        headerName: 'email',
        sortable: false,
        width: 160,
    },
    {
        field: 'position',
        headerName: 'Position',
        width: 150
    }, {
        field: 'score',
        headerName: 'ATS_Score',
        type: 'number',
        width: 110,
        editable: true,
    },
];



function Candidatelist() {
    const { data } = React.useContext(CandidateContext);

    const candidates = data.candidates;
    let rows;
    if (candidates) {

        rows = candidates.map((details, i) => {
            return { id: i + 1, name: details.name, email: details.email, score: details.ats_score, position: details.position }
        })
    }
    return (
        <div className='m-8 w-full'>
            <DataTable columns={columns} rows={rows} />
        </div>
    );
}


export default Candidatelist;