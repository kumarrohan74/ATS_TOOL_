
import * as React from 'react';
import { useEffect, useState } from 'react';
import DataTable from './Datagrid';
import { API_URI, END_POINTS, COLUMNS } from './Constants';
const { GET_CANDIDATES } = END_POINTS;
function Candidatelist() {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(`${API_URI}${GET_CANDIDATES}`)
            .then(res => res.json())
            .then(response => {
                setData(response);
                setLoader(false);
            })
            .catch(err => console.error(err))
    }, []);
    const candidates = data.candidates;
    let rows;
    if (candidates) {
        rows = candidates.map((details) => {
            return {
                id: details?._id, name: details?.name, email: details?.email, applied_position: details?.applied_position,
                status: details?.status, experience: details?.experience?.totalYears, location: details?.location,
            }
        })
    }
    return (
        <div className='m-8 w-4/5'>
            <DataTable columns={COLUMNS} rows={rows} loader={loader} />
        </div>
    );
}

export default Candidatelist;