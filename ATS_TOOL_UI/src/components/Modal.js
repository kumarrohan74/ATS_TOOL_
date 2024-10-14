import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    bgcolor: 'background.paper',
    borderRadius: '.5%',
    boxShadow: 28,
    p: 4,
};

export default function UploadModal(props) {
    const { isOpen, closeModal, score } = props.value
    return (
        <div>

            <Modal
                open={isOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" className="text-center font-bold" sx={{ mt: 2, text: 'bold' }} variant="h5" component="h1">
                        Successfully analysed and uploaded
                    </Typography>
                    <Typography id="modal-modal-description" className="text-center" sx={{ mt: 2, text: 'bold' }} variant="h3" component="h1">
                        <p>ATS Score : {score}%</p>
                    </Typography>
                    <Box display="flex" justifyContent="space-between" gap={4} mt={6}>
                        <Button variant="contained">Check Profile</Button>
                        <Button variant="outlined" onClick={closeModal}>Back to Add Profile</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
