import { Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

const LoginLayout = () => {

    const [data, setData] = useState({ email: '', password: '' });

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };

    return (
        <div className="w-full h-screen grid place-items-center">
            <div className='rounded-lg shadow-lg py-10 px-5'>
                <Typography component="h1" variant="h5" className="text-center">
                    Sign in
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="email"
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        size="small"
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        size="small"
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            marginTop: '1rem',
                            backgroundColor: '#001E43',
                            color: 'white',
                            textTransform: 'capitalize',
                            padding: '0.6rem 2rem !important',
                            borderRadius: '0.5rem',
                            '&:hover': {
                                backgroundColor: '#001E43',
                                color: 'white',
                            }
                        }}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div >
    );

}

export default LoginLayout;
