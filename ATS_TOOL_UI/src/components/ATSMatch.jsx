import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import UploadModal from "./Modal";
import ToggleSwitch from "./common/Checkbox";
import { CandidateContext } from "./Context";
import DataTable from "./Datagrid";
import { COLUMNS } from './Constants';

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


function ATSMatch() {

    const [isOpen, setIsOpen] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [score, setScore] = useState();
    const [candidateId, setCandidateId] = useState('')
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const { isJDChecked } = React.useContext(CandidateContext);
    const apiURI = process.env.REACT_APP_API_URL;
    const endpoint = '/getCandidatesByScore';

    useEffect(() => {
        if (data[0]) {
            const rows = data[0].map((details) => {
                return {
                    id: details?._id, name: details?.name, email: details?.email, ats_score: Math.round(details?.ats_score), applied_position: details?.applied_position,
                    location: details?.location, status: details?.status, experience: details?.experience?.totalYears
                }
            })
            setFilteredRows(rows);
            setLoader(false)
        }
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            jobDescription, score
        }
        try {
            const response = await axios.post(`${apiURI}${endpoint}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data.response)
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const closeModal = () => setIsOpen(false)
    return (
        <>
            {isOpen && <UploadModal value={{ isOpen, closeModal, score, candidateId, isJDChecked }} />}
            <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full mt-4">
                    <div className="w-full ml-10">
                        <div className="flex justify-between w-11/12">
                            <label
                                className="text-lg font-bold text-gray-700"
                                htmlFor="file_input"
                            >
                                Job Description:
                            </label>
                        </div>
                        <textarea
                            // id="textarea"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className={`border border-gray-300 mt-2 rounded-lg w-11/12  pl-2
                        h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        transition duration-300 placeholder-gray-500 bg-zinc-50`}
                            placeholder="Write your job description here"
                        />
                    </div>
                    <div className="w-full ml-10 my-2">
                        <TextField className="w-11/12" label="Enter ATS Score" variant="outlined" onChange={(e) => setScore(e.target.value)} />
                    </div>
                    <div className="w-11/12 flex justify-end ml-10">
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#3730a3',
                                },
                            }}
                            disabled={!(jobDescription && score)}
                            startIcon={<PersonSearchIcon />}
                            onClick={handleSubmit}
                        >
                            Search Candidates
                        </Button>
                    </div>
                </div>
                {data[0] && data[0].length && (
                    <div className="w-full">
                        <p className="text-2xl py-2 mx-10 font-bold">Matched Candidates</p>
                        <div className="w-11/12 mx-10 shadow-lg p-8" style={{ boxShadow: "0px 4px 6px rgba(128, 128, 128, 0.5)" }}>
                            <DataTable columns={COLUMNS} rows={filteredRows} loader={loader} />
                        </div>
                    </div>
                )}
            </form>
        </>)
}

export default ATSMatch;
