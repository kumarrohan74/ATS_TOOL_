
import * as React from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';


function Login({ handleLoginSuccess }) {

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white w-[1000px] h-[500px] shadow-lg rounded-lg grid grid-cols-2">
                <div className="flex justify-center items-center bg-blue-100 rounded-l-lg">
                    <img src="./ATS_LOGO.jpg" alt="Login Image" className="w-[150px] h-[150px] object-cover rounded-full" />
                </div>
                <div className="p-6 flex flex-col justify-center">
                    <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        className="mb-3 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-3 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                    />
                    <Button variant="contained" disabled>Login</Button>
                    <div className='flex justify-center text-2xl my-4 font-bold'>
                        <h1>OR</h1>
                    </div>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<GoogleIcon />}
                        onClick={handleLoginSuccess}
                    >
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </div>

    );
}


export default Login;