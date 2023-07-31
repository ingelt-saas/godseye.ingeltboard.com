import { Close } from '@mui/icons-material';
import { Autocomplete, Button, CircularProgress, IconButton, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import studentApi from '../../api/student';
import ProfileImage from '../shared/ProfileImage';
import ReactDatePicker from 'react-datepicker';
import sessionApi from '../../api/session';
import { toast } from 'react-toastify';

const AddSession = ({ open: modalOpen, close, refetch }) => {

    // states
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // react-hook-form
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

    // close modal
    const handleClose = () => {
        close();
    }

    // debounce function
    const debounce = (func, delay) => {
        let timerId;

        return function (...args) {
            clearTimeout(timerId);

            timerId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // student search handler
    const studentSearchHandler = async (e, value) => {
        if (!value) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await studentApi.searchStudents(value);
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // session create handler
    const sessionCreateHandler = async (data) => {
        setSubmitting(true)
        try {
            await sessionApi.create(data);
            refetch();
            reset();
            toast.success('Session created');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal open={modalOpen} onClose={handleClose} className='grid place-items-center'>
            <div className='outline-none bg-white rounded-md px-5 py-8 relative'>
                <IconButton onClick={handleClose} className='!absolute !top-4 !right-5'>
                    <Close />
                </IconButton>
                <h2 className='pb-2 text-xl font-semibold text-center border-b'>Add Session</h2>
                <form onSubmit={handleSubmit(sessionCreateHandler)} className='min-w-[500px] mt-5 flex flex-col gap-y-4'>
                    <div className=''>
                        <Controller
                            control={control}
                            name='studentId'
                            rules={{ required: 'Student is required' }}
                            render={({ field: { value, onChange } }) => <Autocomplete
                                id='asynchronous-autocomplete'
                                size='small'
                                options={students}
                                loading={loading}
                                onChange={(e, val) => onChange(val?.id || '')}
                                value={Array.isArray(students) ? students.find(i => i.id === value) || null : null}
                                getOptionLabel={(option) => option.name}
                                onInputChange={debounce(studentSearchHandler, 1000)}
                                noOptionsText='No Students Found'
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Student"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? <CircularProgress color="inherit" size={16} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option, { selected }) => <li {...props} className={`px-4 text-sm hover:bg-[#f2f2f2] ${selected && 'bg-[#f2f2f2]'} duration-200 cursor-pointer !py-2 !my-0 flex items-center gap-x-3`}>
                                    <ProfileImage alt={option.name} className={'w-9 h-9 rounded-full object-cover'} gender={option.gender} src={option.image} />
                                    <span className='flex flex-col'>
                                        <span>{option.name}</span>
                                        <span className='text-xs'>{option.id}</span>
                                    </span>
                                </li>}
                            />}
                        />
                        {errors?.studentId && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.studentId?.message}</span>}
                    </div>
                    <div>
                        <TextField
                            size='small'
                            label='Session title'
                            fullWidth
                            {...register('title', { required: false })}
                        />
                        {errors?.title && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.title?.message}</span>}
                    </div>
                    <div>
                        <TextField
                            multiline
                            rows={4}
                            maxRows={6}
                            size='small'
                            label='Session description'
                            fullWidth
                            {...register('desc', { required: false })}
                        />
                        {errors?.desc && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.desc?.message}</span>}
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name='schedule'
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => <ReactDatePicker
                                className='focus:outline-none text-left px-4 cursor-pointer whitespace-nowrap border !w-full py-2 text-sm rounded-md'
                                selected={value}
                                onChange={onChange}
                                wrapperClassName='w-full'
                                placeholderText={'Click to set schedule'}
                                timeIntervals={15}
                                showTimeSelect={true}
                                minDate={new Date()}
                            />}
                        />
                        {errors?.schedule && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.schedule?.message}</span>}
                    </div>

                    <div>
                        <Button
                            type='submit'
                            disabled={submitting}
                            startIcon={submitting && <CircularProgress size={16} />}
                            variant='contained'
                            className='!capitalize !font-medium !text-sm !py-3 !w-full'
                        >Submit</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default AddSession;
