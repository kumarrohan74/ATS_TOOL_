import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { API_URI, END_POINTS, ALERTS } from "./Constants";
import ATSScoreCard from './ATSScoreCard';
const { CANDIDATE } = END_POINTS;
const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '40',
    bgcolor: 'background.paper',
    borderRadius: '.5%',
    boxShadow: 28,
    p: 4,
};
const url = process.env.REACT_APP_API_URL;

export default function UploadModal(props) {
    const { isOpen, closeModal, score, candidateId, isJDChecked } = props.value;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    const HandleBackToProfile = async () => {
        try {
            setIsLoading(true);
            const fetchProfile = await fetch(`${API_URI}${CANDIDATE}/${candidateId}`);
            const response = await fetchProfile.json();
            if (response) {
                setIsLoading(false);
            }
            navigate(`${CANDIDATE}/${candidateId}`, { state: { candidate: response } });
        }
        catch (e) {
            console.error(ALERTS.FAILED_TO_SWITCH, e)
        }
    }
    return (
        <div>
            <Modal
                open={isOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        onClick={closeModal}
                        sx={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            color: 'black',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {/*UPLOADED RESUME AND PROFILE CHECK*/}
                    {
                        !isJDChecked ? (<div>
                            <Typography id="modal-modal-title" className="text-center font-bold" sx={{ mt: 2, text: 'bold' }} variant="h5" component="h1">
                                Resume successfully uploaded
                            </Typography>
                            <Box display="flex" justifyContent="space-between" gap={4} mt={6}>
                                <Button variant="contained" onClick={HandleBackToProfile}>Check Profile</Button>
                                <Button variant="outlined" onClick={closeModal}>Back to Upload Profile</Button>
                            </Box>
                        </div>)
                            : (<div>
                                {/*CHECK ONLY APPLICANT PROFILE'S SCORE */}
                                <Typography id="modal-modal-title" className="text-center font-bold" sx={{ mt: 2, text: 'bold' }} variant="h5" component="h1">
                                    Profile successfully analysed and Applicant's score is
                                </Typography>
                                <Typography className="text-center" sx={{}} >
                                    <ATSScoreCard score={score} />
                                </Typography>
                            </div>)
                    }
                </Box>
            </Modal>
        </div>
    );
}
