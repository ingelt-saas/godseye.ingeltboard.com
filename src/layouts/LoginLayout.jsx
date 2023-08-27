import { Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import authApi from "../api/auth";
import Cookies from "js-cookie";
import {Link} from 'react-router-dom'

const LoginLayout = () => {

    const [data, setData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.login(data.email, data.password);
            Cookies.set('ingelt_token', res.data?.token, { expires: 1 });
            window.location.reload();
        } catch (err) {
            setError(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen grid place-items-center bg-[#f2f2f2]">
            <div className='rounded-lg  bg-white shadow-lg py-10 px-5 w-11/12 sm:w-[500px]'>
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
                    {error && <p className="text-center text-red-500 text-xs font-medium">{error}</p>}
                    <Link to="/reset-password">
                        <span className="text-center text-blue-500 text-xs font-medium">Forgot Password?</span>
                    </Link>
                    <Button
                        disabled={Object.values(data).includes('') || loading}
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
