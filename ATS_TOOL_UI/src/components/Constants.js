const API_URI = process.env.REACT_APP_API_URL;
const END_POINTS = {
    GET_CANDIDATES: "/get-candidates",
    CANDIDATE: "/candidate",
    CANDIDATE_LIST: "/candidatelist",
    ADD_PROFILE: "/addprofile",
    UPLOAD_RESUME: "/resume-upload",
    GET_CANDIDATES_BY_SCORE: "/getCandidatesByScore"
};
const ALERTS = {
    UPLOAD_RESUME_ERROR: "Please upload resume file",
    ERROR_UPLOAD: "Error uploading files: ",
    FAILED_TO_SWITCH: "failed to swtich back to added profile",
    NO_DESCRIPTION: "No description available for this candidate.",
    HTTP_ERROR: "HTTP error! status: ",
    APPLIED_POSITION: 'Please select role'
};
const COLORS = {
    RED: '#FF0000',
    ORANGE: '#FFA500',
    YELLOW: '#FFFF00',
    GREEN: '#008000',
    BLUE: '#0000FF',
    INDIGO: '#4B0082',
    VIOLET: '#EE82EE',
};
const COLUMNS = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Full Name',
        width: 180,
        renderCell: (params) => (
            <span style={{ color: 'blue' }}>{params.value}</span>
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

export { API_URI, END_POINTS, ALERTS, COLORS, COLUMNS };


