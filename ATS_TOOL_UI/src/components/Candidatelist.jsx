
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DataTable from './Datagrid';
import { API_URI, END_POINTS, COLUMNS, ALERTS } from './Constants';
const { GET_CANDIDATES, CANDIDATE } = END_POINTS;

function Candidatelist() {

    const navigate = useNavigate();

    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [openLoader, setOpenLoader] = useState(false);

    const columns = [
        { field: 'serial', headerName: 'S.No.', width: 90,
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id)+1
         },
        {
            field: 'name',
            headerName: 'Full Name',
            width: 180,
            renderCell: (params) => (
                <span style={{ color: 'blue' }} onClick={() => handleSingleProfile(params.row)}>{params.value}</span>
            ),
        },
        {
            field: 'email',
            headerName: 'Email',
            sortable: false,
            width: 200,
        },
        {
            field: 'applied_position',
            headerName: 'Role',
            width: 200,
        },
        {
            field: 'status',
            headerName: 'Application Status',
            width: 180,
        },
        {
            field: 'experience',
            headerName: 'Experience(years)',
            type: 'number',
            width: 160,
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 200,
        },
    ];

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

    const handleSingleProfile = async (e) => {
        setOpenLoader(true);
        fetch(`${API_URI}${CANDIDATE}/${e.id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`${ALERTS.HTTP_ERROR} : ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setOpenLoader(false);
                navigate(`${CANDIDATE}/${e.id}`, { state: { candidate: data } });
            })
            .catch((err) => console.error(err))
    }

    const handleCloseLoader = () => {
        setOpenLoader(false);
    };

    if (candidates) {
        rows = candidates.map((details,index) => {
            return {
                id: details?._id , name: details?.name, email: details?.email, applied_position: details?.applied_position,
                status: details?.status, experience: details?.experience?.totalYears, location: details?.location,
            }
        })
    }
    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openLoader}
                onClick={handleCloseLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='m-8 w-11/12 h-screen'>
                <DataTable columns={columns} rows={rows} loader={loader} />
            </div>
        </>

    );
}

export default Candidatelist;