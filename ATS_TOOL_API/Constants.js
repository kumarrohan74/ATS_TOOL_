const STATUS_CODES = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    CREATED: 201
};
const DATABASE_LISTS = {
    ATS_MASTER_DATA: "ATS_master_data",
    CANDIDATES_DB: 'candidates_list_updated',
};
const END_POINTS = {
    GET_CANDIDATES: "/get-candidates",
    RESUME_UPLOAD: "/resume-upload",
    CANDIDATE_ID: "/candidate/:id",
};
const mongoDBConsts = {
    mongodb_connected: "MongoDB Connected",
    error_connecting_to_mongodb: "Error connecting to MongoDB:",
    database_not_initialized: "Database not initialized",
    mongodb_connection_established: "MongoDB connection established.",
    failed_to_connect_to_mongodb: "Failed to connect to MongoDB:",
};
const serverConsts = {
    error_parsing_resume: "Error parsing resume",
    error_fetching_candidates: "Error fetching candidates: ",
    server_running: "Server is running on port"
};
const messages = {
    data_added: ' Data added'
};
module.exports = { STATUS_CODES, mongoDBConsts, serverConsts, DATABASE_LISTS, messages, END_POINTS };