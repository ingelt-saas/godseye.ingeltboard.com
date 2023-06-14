import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Textarea } from "@mui/joy";
import ImageCropper from "../shared/ImageCropper";

const AddBlog = () => {

    const [error, setError] = useState('');
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [typeError, setTypeError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, control, formState: { errors } } = useForm();
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

    const blogAddHandler = async (data) => {
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
            // await universityApi.create(formData);
            reset();
            // refetch();
            setSelectedLogo(null);
            toast.success('Blog added successfully');
        } catch (err) {
            setError('Sorry! Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="lg:w-10/12 mx-auto bg-white shadow-lg rounded-xl px-5 py-10">
                <form onSubmit={handleSubmit(blogAddHandler)} className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <TextField
                            fullWidth
                            id="standard-basic"
                            type='text'
                            label='Title'
                            variant="standard"
                            InputLabelProps={{ className: '!text-base !pl-3' }}
                            sx={{
                                '& .MuiInput-underline:after': {
                                    borderColor: '#001E43 !important',
                                },
                                '& label.Mui-focused': {
                                    color: '#001E43 !important',
                                }
                            }}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors?.title && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{errors?.title?.message}</p>}
                    </div>
                    <div className="">
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => <Textarea
                                placeholder="Description...."
                                {...field}
                                minRows={4}
                                maxRows={6}
                                endDecorator={
                                    <small className="ml-auto">{field.value?.length || 0} character(s)</small>
                                }
                                sx={{
                                    '&:before': {
                                        boxShadow: 'none !important',
                                    },
                                }}
                            />}
                        />
                        {errors?.description && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{errors?.description?.message}</p>}
                    </div>
                    <div className="">
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {!selectedLogo && <div className="text-center py-5 border-2 border-dashed cursor-pointer">
                                <p className="text-sm">Drag 'n' drop thumbnail here, or click to select thumbnail</p>
                                <p className="text-sm opacity-75">Accept .png, .jepg, .webp</p>
                            </div>}
                            {selectedLogo && <div className="rounded-md overflow-hidden cursor-pointer">
                                <img src={URL.createObjectURL(selectedLogo)} alt='logo' className="max-w-full max-h-full" />
                            </div>}
                        </div>
                        {typeError && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{typeError}</p>}
                    </div>
                    <div>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="demo-simple-select-standard-label" className="!pl-3 !text-base">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                label="Category"
                                InputLabelProps={{ className: '!text-base !pl-3' }}
                                sx={{
                                    '& .MuiInput-underline:after': {
                                        borderColor: '#001E43 !important',
                                    },
                                    '& label.Mui-focused': {
                                        color: '#001E43 !important',
                                    }
                                }}
                                {...register('category', { required: 'Category is required' })}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value='Category One'>Category One</MenuItem>
                                <MenuItem value='Category Two'>Category Two</MenuItem>
                                <MenuItem value='Category Three'>Category Three</MenuItem>
                                <MenuItem value='Category Four'>Category Four</MenuItem>
                            </Select>
                        </FormControl>
                        {errors?.category && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{errors?.category?.message}</p>}
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
                            Post Blog
                        </Button>
                    </div>
                </form>
            </div>
            <ImageCropper />
        </>
    );
}

export default AddBlog;
