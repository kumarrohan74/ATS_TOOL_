import React, { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button, TextField } from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import UploadModal from "./Modal";
import { CandidateContext } from "./Context";
import DataTable from "./Datagrid";
import { END_POINTS, API_URI, ALERTS } from './Constants';

function ATSMatch() {

    const navigate = useNavigate();

    const { CANDIDATE } = END_POINTS;

    const [isOpen, setIsOpen] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [score, setScore] = useState();
    const [candidateId, setCandidateId] = useState('')
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState([]);
    const [openLoader, setOpenLoader] = useState(false);
    const [filteredRows, setFilteredRows] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSnackbarClick = () => {
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = (event, reason) => {
        console.log("clicked")
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    const { isJDChecked } = React.useContext(CandidateContext);
    const apiURI = process.env.REACT_APP_API_URL;
    const endpoint = END_POINTS.GET_CANDIDATES_BY_SCORE;

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
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

    useEffect(() => {
        if (data[0]) {
            if (!data[0]?.length) {
                console.log('also here')
                handleSnackbarClick();
            }
            const rows = data[0].map((details) => {
                return {
                    id: details?._id, name: details?.name, email: details?.email, ats_score: Math.round(details?.ats_score), applied_position: details?.applied_position,
                    location: details?.location, status: details?.status, experience: details?.experience?.totalYears
                }
            })
            setFilteredRows(rows);
            setLoader(false)
        }

    }, [data]);

    const handleCloseLoader = () => {
        setOpenLoader(false);
    };

    const handleSubmit = async (e) => {
        setOpenLoader(true);
        e.preventDefault();
        const payload = {
            jobDescription, score
        }
        try {
            const response = await axios.post(`${apiURI}${endpoint}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            setData(response.data.response)
            setOpenLoader(false);
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const closeModal = () => setIsOpen(false)

    const updatedColumns = [
        ...columns,
        { field: 'ats_score', headerName: 'ATS Score', width: 90 }
    ];

    const downloadAllResumes = async () => {
        const zip = new JSZip();
        const folder = zip.folder("resumes");

        try {
            const downloadPromises = filteredRows.map(async (candidate) => {
                const response = await fetch(`${API_URI}/download/${candidate.id}`);
                if (!response.ok) {
                    throw new Error(`Failed to download resume for ${candidate.name}`);
                }
                const blob = await response.blob();
                const fileName = candidate?.resume?.resumeName || `${candidate.name}_resume.pdf`;
                folder.file(fileName, blob); // Add file to ZIP folder
            });

            await Promise.all(downloadPromises);

            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "resumes.zip"); // Save the ZIP file
            console.log("All resumes downloaded successfully.");
        } catch (error) {
            console.error("Error downloading resumes:", error);
        }
    };

    return (
        <>
            {isOpen && <UploadModal value={{ isOpen, closeModal, score, candidateId, isJDChecked }} />}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openLoader}
                onClick={handleCloseLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    No Candidates found
                </Alert>
            </Snackbar>
            <form onSubmit={handleSubmit} className="w-5/6">
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
                {data[0]?.length ? (
                    <div className="w-full">
                        <p className="text-2xl py-2 mx-10 font-bold">Matched Candidates</p>
                        <div className="w-11/12 mx-10 shadow-lg p-8 shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={downloadAllResumes}
                                        style={{ marginTop: '20px' }}
                                        sx={{
                                            backgroundColor: '#4f46e5',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#3730a3',
                                            },
                                        }}
                                    >
                                        Download All Resumes
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full">
                                <DataTable columns={updatedColumns} rows={filteredRows} loader={loader} />
                            </div>
                        </div>
                    </div>
                ) : (
                    null
                )}
            </form>
        </>)
}

export default ATSMatch;
