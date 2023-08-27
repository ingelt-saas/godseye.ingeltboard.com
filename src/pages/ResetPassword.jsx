import {TextField, Button } from "@mui/material";
import { useState } from "react";
import authApi from "../api/auth";

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendPasswordUpdateEmail = (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);
    authApi.resetPasswordEmail(email).then(res=>{
      setStatus(res?.data?.message);
    }).catch(err=>{
      setError(err?.response?.data?.message)
    }).finally(()=>{
      setEmail('')
      setLoading(false);
    }) 
  }

  return (
    <div className='bg-white w-screen h-screen'>
      <div className="px-10 h-full flex justify-center items-center">
        <form onSubmit={handleSendPasswordUpdateEmail}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-center text-red-500 text-xs font-medium">{error}</p>}
          {status && <p className="text-center text-green-500 text-xs font-medium">{status}</p>}

          <Button
            disabled={!email || loading}
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
            Send Reset Password Link
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword