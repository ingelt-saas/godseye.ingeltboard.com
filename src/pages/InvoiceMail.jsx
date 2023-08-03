import { useState } from "react";
import studentApi from "../api/student";
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import ProfileImage from "../components/shared/ProfileImage";
import { Controller, useForm } from "react-hook-form";
import mailApi from "../api/mail";
import { toast } from "react-toastify";

const InvoiceMail = () => {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // react-hook-form
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

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

    // send mail handler
    const sendMail = async (data) => {
        setSubmitting(true);
        try {
            await mailApi.sendSessionInvoice(data);
            reset();
            toast.success('Invoice sent successfully');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="px-5 h-full">
            <div className="h-full bg-white p-6 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit(sendMail)} className="flex gap-5 rounded-md shadow-lg p-4">
                    <div className="flex flex-1 gap-5">
                        <div className="flex flex-col flex-1">
                            <Controller
                                control={control}
                                name='student'
                                rules={{ required: 'Student is required' }}
                                render={({ field: { value, onChange } }) => <Autocomplete
                                    id='asynchronous-autocomplete'
                                    size='small'
                                    options={students}
                                    loading={loading}
                                    onChange={(e, val) => onChange(val || '')}
                                    value={Array.isArray(students) ? students.find(i => i.id === value?.id) || null : null}
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
                                                    <>
                                                        {loading ? <CircularProgress color="inherit" size={16} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
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
                            {errors?.student && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.student?.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <TextField
                            size="small"
                            label="Amount"
                            type="number"
                            {...register('amount', { required: 'Amount is required' })}
                        />
                        {errors?.amount && <span className='text-xs text-red-500 font-medium mt-1'>{errors?.amount?.message}</span>}
                    </div>
                    <div className="w-fit">
                        <Button
                            type='submit'
                            disabled={submitting}
                            startIcon={submitting && <CircularProgress size={16} />}
                            variant='contained'
                            className='!capitalize !font-medium !text-sm !py-3'
                        >Send</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InvoiceMail;
