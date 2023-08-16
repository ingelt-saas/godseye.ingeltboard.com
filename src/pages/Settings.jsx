import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminContext } from '../contexts';
import { Button, CircularProgress, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import authApi from '../api/auth';
import { toast } from 'react-toastify';

const Settings = () => {

    // states
    const [loading, setLoading] = useState(false);

    // context
    const { inGelt } = useContext(AdminContext);

    // react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: inGelt.email,
            classFee: inGelt.classFee,
            sessionFee: inGelt.sessionFee,
            moduleFee: inGelt.moduleFee,
        }
    });

    const updateAdmin = async (data) => {

        setLoading(true);
        try {
            await authApi.updateInGelt(data);
            toast.success('InGelt Updated');
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Settings</h1>
            <form onSubmit={handleSubmit(updateAdmin)} className="grid grid-cols-1 md:w-1/2 mt-10 gap-5 md:px-5">
                <div className=''>
                    <TextField
                        fullWidth
                        size='small'
                        type='email'
                        InputLabelProps={{ className: '!text-sm' }}
                        inputProps={{ className: '!text-sm' }}
                        label={'Email'}
                        {...register('email', { required: 'Email is required' })}
                    />
                    {errors['email'] && <span className='text-xs text-red-500 font-medium'>{errors['email'].message}</span>}
                </div>
                <FormControl fullWidth size='small'>
                    <InputLabel className='!text-sm' htmlFor="outlined-adornment-amount">Class Fee</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">&#8377; </InputAdornment>}
                        label="Class Fee"
                        inputProps={{ className: '!text-sm' }}
                        {...register('classFee', { required: false, min: 0 })}
                    />
                </FormControl>
                <FormControl fullWidth size='small'>
                    <InputLabel className='!text-sm' htmlFor="outlined-adornment-amount">Session Fee</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">&#8377; </InputAdornment>}
                        label="Session Fee"
                        inputProps={{ className: '!text-sm' }}
                        {...register('sessionFee', { required: false, min: 0 })}
                    />
                </FormControl>
                <FormControl fullWidth size='small'>
                    <InputLabel className='!text-sm' htmlFor="outlined-adornment-amount">Module Fee</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">&#8377; </InputAdornment>}
                        label="Module Fee"
                        inputProps={{ className: '!text-sm' }}
                        {...register('moduleFee', { required: false, min: 0 })}
                    />
                </FormControl>
                <div className=''>
                    <Button
                        disabled={loading}
                        variant='contained'
                        type='submit'
                        startIcon={loading && <CircularProgress size={16} color='inherit' />}
                    >Save</Button>
                </div>
            </form>
        </div>
    );
}

export default Settings;
