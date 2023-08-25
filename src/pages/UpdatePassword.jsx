import { useEffect, useState } from 'react';
import {TextField, Button } from "@mui/material";
import { useSearchParams, useNavigate } from 'react-router-dom';
import authApi from '../api/auth';

function UpdatePassword() {
  const [search] = useSearchParams();
  const [token] = useState(search.get('token'));
  const navigate= useNavigate();

  const [password, setPassword] = useState({pwd: '', confPwd: ''});
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handlePasswordUpdate= (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    authApi.updatePassword(token, password.pwd).then(res=>{
      setStatus(res?.data?.message)
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }).catch(err=>{
      setError(err?.response?.data?.message)
    })
  }

  useEffect(()=>{
    if(password.confPwd !== password.pwd) {
      setError("Password and confirm password are different.");
      setStatus("");
    } else {
      setError("");
    }
  }, [password.confPwd, password.pwd])

  return (
    <div className='bg-white w-screen h-screen'>
      <div className="px-10 h-full flex justify-center items-center">
        <form onSubmit={handlePasswordUpdate} className='max-w-[400px]'>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="Password"
            id="Password"
            label="New Password"
            name="password"
            autoComplete="password"
            autoFocus
            size="small"
            value={password.pwd}
            onChange={(e) => setPassword({...password, pwd: e.target.value})}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="confirm password"
            label="Confirm Password"
            name="confirm_password"
            autoComplete="confirm password"
            size="small"
            value={password.confPwd}
            onChange={(e) => setPassword({...password, confPwd: e.target.value})}
          />
          {error && <p className="text-center text-red-500 text-xs font-medium">{error}</p>}
          {status && <p className="text-center text-green-500 text-xs font-medium">{status}</p>}
          <Button
            disabled={(!password.pwd || !password.confPwd) || (password.confPwd !== password.pwd)}
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
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword