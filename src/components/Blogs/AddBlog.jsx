import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Textarea } from "@mui/joy";
import ImageCropper from "../shared/ImageCropper";
import blogsApi from "../../api/blogs";
import { useQuery } from "@tanstack/react-query";
import categoryApi from "../../api/category";
import RichEditor from "./RichEditor/RichEditor";

const AddBlog = ({ refetch }) => {

    const [error, setFormError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, control, reset, setValue, getValues, clearErrors, setError, resetField, formState: { errors } } = useForm();

    const { data: categories = [], } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await categoryApi.read();
            return res.data;
        }
    });

    const blogAddHandler = async (data) => {

        if (!selectedImage) {
            toast.error('Please select thumbnail');
            return;
        }

        const formData = new FormData();
        formData.append('thumbnail', selectedImage);

        for (let key in data) {
            formData.append(key, data[key]);
        }

        setLoading(true);
        setFormError('');
        try {
            await blogsApi.create(formData);
            reset();
            resetField();
            refetch();
            setSelectedImage(null);
            toast.success('Blog added successfully');
        } catch (err) {
            setFormError('Sorry! Something went wrong');
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
                    <div className="col-span-2">
                        <RichEditor
                            content={getValues('content')}
                            changeHandler={(html, text) => {
                                if (text.trim()) {
                                    setValue('content', html);
                                    setValue('textContent', text.trim());
                                    clearErrors('content');
                                } else {
                                    setError('content', { type: 'custom', message: 'Content is required' });
                                }
                            }}
                        />
                        {errors?.content && <p className="text-xs mt-1 text-left text-red-500 font-medium mb-3">{errors?.content?.message}</p>}
                    </div>
                    <div className="">
                        <ImageCropper
                            resizableImage={(e) => setSelectedImage(e)}
                        >
                            {!selectedImage && <div className="text-center py-5 border-2 border-dashed cursor-pointer">
                                <p className="text-sm">Drag 'n' drop thumbnail here, or click to select thumbnail</p>
                                <p className="text-sm opacity-75">Accept .png, .jepg, .webp</p>
                            </div>}

                            {selectedImage && <div className="rounded-lg overflow-hidden cursor-pointer">
                                <img src={URL.createObjectURL(selectedImage)} alt='logo' className="w-full h-auto" />
                            </div>}
                        </ImageCropper>
                    </div>
                    <div>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: 'Category is required' }}
                            render={({ field: { name, onChange, ref, value } }) =>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="demo-simple-select-standard-label" className="!pl-3 !text-base">Category</InputLabel>
                                    <Select
                                        name={name}
                                        ref={ref}
                                        onChange={onChange}
                                        value={value || ''}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        label="Category"
                                        // InputLabelProps={{ className: '!text-base !pl-3' }}
                                        sx={{
                                            '& .MuiInput-underline:after': {
                                                borderColor: '#001E43 !important',
                                            },
                                            '& label.Mui-focused': {
                                                color: '#001E43 !important',
                                            }
                                        }}
                                        defaultValue={''}
                                        MenuProps={{ sx: { maxHeight: '50vh' } }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {categories.map(i => <MenuItem key={i.id} value={i.name}>{i.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            }
                        />

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
        </>
    );
}

export default AddBlog;
