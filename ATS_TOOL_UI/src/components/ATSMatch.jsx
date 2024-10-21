import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import UploadModal from "./Modal";
import { CandidateContext } from "./Context";
import DataTable from "./Datagrid";
import { COLUMNS, END_POINTS } from './Constants';

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
    const endpoint = END_POINTS.GET_CANDIDATES_BY_SCORE;

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

    const updatedColumns = [
        ...COLUMNS,
        { field: 'ats_score', headerName: 'ATS Score', width: 90 }
    ];

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
                            <DataTable columns={updatedColumns} rows={filteredRows} loader={loader} />
                        </div>
                    </div>
                )}
            </form>
        </>)
}

export default ATSMatch;
