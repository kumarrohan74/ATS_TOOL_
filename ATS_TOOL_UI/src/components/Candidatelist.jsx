
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

/*const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];*/

function Candidatelist() {
    const data = React.useContext(CandidateContext);

    const candidates = data.candidates;
    let pagesRequired;
    pagesRequired = candidates ? Math.round(candidates.length / 10) : 0
    let rows;
    if (candidates) {

        rows = candidates.map((details) => {
            return { id: details.id, name: details.name, email: details.email, score: details.ats_score, position: details.position }
        })
    }
    return (
        <div className='m-8 w-full'>
            <DataTable columns={columns} rows={rows} />
        </div>
    );
}


export default Candidatelist;