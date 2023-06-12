import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import universityApi from "../../api/university";
import { toast } from "react-toastify";

const TextInputField = ({ label, name, defaultValue, validation, Form, type }) => {
    const { register, formState: { errors } } = Form;
    return (
        <div className="">
            <TextField
                fullWidth
                id="standard-basic"
                type={type}
                label={label}
                variant="standard"
                defaultValue={defaultValue || ''}
                InputLabelProps={{ className: '!text-sm !pl-3' }}
                sx={{
                    '& .MuiInput-underline:after': {
                        borderColor: '#001E43 !important',
                    },
                    '& label.Mui-focused': {
                        color: '#001E43 !important',
                    }
                }}
                {...register(name, validation)}
            />
            {errors[name] && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{errors[name]?.message}</p>}
        </div>
    );
}

const AddUniversity = ({ refetch }) => {

    const [error, setError] = useState('');
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [typeError, setTypeError] = useState('');
    const [loading, setLoading] = useState(false);

    const Form = useForm();
    const { handleSubmit, reset } = Form;
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'image/png': ['.png', '.jpeg', '.webp']
        },
        onDrop: (acceptFiles, rejectFiles) => {
            if (rejectFiles.length > 0) {
                setTypeError('File type not supported');
            } else {
                setSelectedLogo(acceptFiles[0]);
                setTypeError('');
            }
        },
    });

    const inputFields = [
        {
            name: 'name',
            label: 'University Name',
            defaultValue: '',
            validation: {
                required: 'University name is required',
            },
            type: 'text'
        },
        {
            name: 'address',
            label: 'University Location',
            defaultValue: '',
            validation: {
                required: 'University location is required',
            },
            type: 'text'
        },
        {
            name: 'ranking',
            label: 'University Ranking',
            defaultValue: '',
            validation: {
                required: 'University ranking is required',
            },
            type: 'number'
        },
        {
            name: 'yearlyFee',
            label: 'Yearly Fee', defaultValue: '',
            validation: {
                required: 'Yearly fee is required',
                pattern: {
                    value: /^\$?(\d{1,3}(,\d{3})*(\.\d{2})?|\.\d{2})$/,
                    message: 'Yearly fee should be like 10,000 or 11,111.11',
                }
            },
            type: 'text'

        },
        {
            name: 'courseName',
            label: 'Course Name', defaultValue: '',
            validation: {
                required: 'Course name is required',
            },
            type: 'text'
        },
        {
            name: 'courseDuration',
            label: 'Course Duration',
            defaultValue: '',
            validation: {
                required: 'Course duration is required',
                pattern: {
                    value: /^-?\d+\.\d$/,
                    message: 'Course duration should be like 4 or 4.5 ',
                }
            },
            type: 'text'
        },
    ];

    const universityHandler = async (data) => {
        if (!selectedLogo) {
            setError('Logo is required');
            return;
        }
        const formData = new FormData();
        formData.append('logo', selectedLogo);
        for (let key in data) {
            formData.append(key, data[key]);
        }
        setLoading(true);
        setError('');
        try {
            await universityApi.create(formData);
            reset();
            refetch();
            setSelectedLogo(null);
            toast.success('University successfully added');
        } catch (err) {
            setError('Sorry! Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="bg-white shadow-xl rounded-lg py-10 px-5 lg:w-10/12 mx-auto">
                <form onSubmit={handleSubmit(universityHandler)} className="grid grid-cols-2 gap-5">
                    {inputFields.map(item =>
                        <TextInputField
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            type={item.type}
                            defaultValue={item.defaultValue}
                            validation={item.validation}
                            Form={Form}
                        />
                    )}
                    <div className="">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {!selectedLogo && <div className="text-center py-5 border-2 border-dashed cursor-pointer">
                                <p className="text-sm">Drag 'n' drop logo here, or click to select logo</p>
                                <p className="text-sm opacity-75">Accept .png, .jepg, .webp</p>
                            </div>}
                            {selectedLogo && <div className="rounded-md overflow-hidden cursor-pointer">
                                <img src={URL.createObjectURL(selectedLogo)} alt='logo' className="max-w-full max-h-full" />
                            </div>}
                        </div>
                        {typeError && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{typeError}</p>}
                    </div>
                    <div className="col-span-2 mt-5">
                        {error && <p className="text-sm text-center text-red-500 font-medium mb-3">{error}</p>}
                        <Button
                            disabled={loading}
                            variant="contained"
                            sx={{
                                backgroundColor: '#001E43',
                                textTransform: 'capitalize',
                                color: 'white',
                                width: '100%',
                                padding: '0.6rem 2rem',
                                '&:hover': {
                                    backgroundColor: '#001E43'
                                }
                            }}
                            type="submit"
                        >
                            Add University
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUniversity;
