import { Textarea } from "@mui/joy";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import modulesApi from "../api/modules";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Image from "../components/shared/Image";
import getFile from "../api/getFile";

const ModuleThumbnail = ({ setThumbnail, setThumbnailError }) => {

    const onDrop = useCallback((acceptFile, rejectFile) => {
        if (rejectFile.length > 0) {
            setThumbnailError('File type not supported');
        } else {
            setThumbnailError('');
            setThumbnail(acceptFile[0]);
        }
    });

    const { getInputProps, getRootProps } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });
    return (<div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="py-10 bg-white border-2 border-dashed border-black text-center shadow-md opacity-80">
            <p>Drag 'n' drop module thumbnail here, or click to select module thumbnail</p>
        </div>
    </div>);
}

const AddModule = () => {

    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [moduleError, setModuleError] = useState('');
    const [thumbnailError, setThumbnailError] = useState('');
    const [moduleData, setModuleData] = useState({ name: '', description: '', subject: '', releaseDate: null });
    const [errors, setErrors] = useState({});
    const [search] = useSearchParams();
    const moduleId = search.get('id');

    const onDrop = useCallback((acceptFile, rejectFile) => {
        if (rejectFile.length > 0) {
            setModuleError('File type not supported');
        } else {
            setModuleError('');
            setSelectedModule(acceptFile[0]);
        }
    });

    const { getInputProps, getRootProps } = useDropzone({ onDrop, accept: { 'video/*': [] }, multiple: false });

    // video duration
    const getVideoDuration = (file) => new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file)
        video.onloadedmetadata = () => {
            resolve(video.duration);
        }
    });

    // add module handler 
    const addModuleHandle = async (e) => {

        const newErrors = {};
        const currentDateTime = new Date();
        const releaseDate = new Date(moduleData.releaseDate);

        if (!selectedThumbnail) {
            newErrors.thumbnail = 'Module thumbnail is required';
        }
        if (!moduleData.description) {
            newErrors.description = 'Module description is required';
        }
        if (!moduleData.name) {
            newErrors.name = 'Module name is required';
        }
        if (!moduleData.subject) {
            newErrors.subject = 'Module subject is required';
        }
        if (moduleData.releaseDate && (releaseDate.getTime() < currentDateTime.getTime())) {
            newErrors.releaseDate = 'Release date should be greater than the current date and time';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            if (!selectedModule && !moduleData.releaseDate) {
                setErrors({ formError: 'Please select module release date' });
                return;
            } else {
                setErrors({});
            }
        }



        e.target.disabled = true;
        const formData = new FormData();

        if (selectedModule) {
            const duration = await getVideoDuration(selectedModule);
            formData.append('file', selectedModule);
            formData.append('duration', duration);
        }

        formData.append('thumbnail', selectedThumbnail);
        formData.append('subject', moduleData.subject);
        formData.append('name', moduleData.name);
        formData.append('description', moduleData.description);
        if (moduleData.releaseDate) {
            formData.append('releaseDate', moduleData.releaseDate);
        }

        try {
            await modulesApi.create(formData);
            toast.success('Module added successfully');
            setSelectedModule(null);
            setSelectedThumbnail(null);
            setModuleData({ name: '', description: '', subject: '', releaseDate: null });
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            e.target.disabled = false;
        }

    }

    // const update module handler
    const updateModule = async (e) => {

        const newErrors = {};
        const currentDateTime = new Date();
        const releaseDate = new Date(moduleData.releaseDate);

        if (!selectedThumbnail) {
            newErrors.thumbnail = 'Module thumbnail is required';
        }
        if (!moduleData.description) {
            newErrors.description = 'Module description is required';
        }
        if (!moduleData.name) {
            newErrors.name = 'Module name is required';
        }
        if (!moduleData.subject) {
            newErrors.subject = 'Module subject is required';
        }
        if (moduleData.releaseDate && (releaseDate.getTime() < currentDateTime.getTime())) {
            newErrors.releaseDate = 'Release date should be greater than the current date and time';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            if (!selectedModule && !moduleData.releaseDate) {
                setErrors({ formError: 'Please select module release date' });
                return;
            } else {
                setErrors({});
            }
        }



        e.target.disabled = true;
        const toastId = toast.loading('Updating...');
        const formData = new FormData();

        if (selectedModule && typeof selectedModule === 'object') {
            const duration = await getVideoDuration(selectedModule);
            formData.append('file', selectedModule);
            formData.append('duration', duration);
        }

        if (selectedThumbnail && typeof selectedThumbnail === 'object') {
            formData.append('thumbnail', selectedThumbnail);
        }

        formData.append('subject', moduleData.subject);
        formData.append('name', moduleData.name);
        formData.append('description', moduleData.description);
        if (moduleData.releaseDate) {
            formData.append('releaseDate', moduleData.releaseDate);
        }

        try {
            await modulesApi.update(moduleId, formData);
            toast.success('Module update successfully');
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            toast.dismiss(toastId);
            e.target.disabled = false;
        }

    }

    useEffect(() => {
        if (moduleId) {
            modulesApi.readById(moduleId)
                .then(res => {
                    const getModule = res.data;
                    setModuleData({ ...getModule, releaseDate: new Date(getModule.releaseDate).toISOString().slice(0, 16) });
                    if (getModule?.thumbnail) {
                        setSelectedThumbnail(getModule.thumbnail);
                    }
                    if (getModule?.file) {
                        setSelectedModule(getModule.file);
                    }
                })
        }
    }, [moduleId]);

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Add Module</h1>
            <div className="flex gap-x-5 max-md:flex-col max-md:gap-y-5 mt-10">
                <div className="md:w-1/2">
                    <div className="w-full">
                        {selectedModule && <ReactPlayer
                            url={typeof selectedModule === 'object' ? URL.createObjectURL(selectedModule) : getFile(selectedModule).then(res => res.data)}
                            style={{ borderRadius: '10px', overflow: 'hidden' }}
                            playing={false}
                            width="100%"
                            height="100%"
                            volume={1}
                            pip={true}
                            controls
                            config={{
                                file: {
                                    attributes: {
                                        controlsList: 'nodownload',
                                    },
                                },
                            }}
                        />}
                        {!selectedModule && <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className="py-10 bg-white border-2 border-dashed border-black text-center shadow-md opacity-80">
                                <p>Drag 'n' drop module here, or click to select module</p>
                            </div>
                        </div>}
                        {moduleError && <p className="text-sm mt-3 font-medium text-center text-red-500 ">{moduleError}</p>}
                    </div>
                    <div className="w-full mt-10">
                        {selectedThumbnail && typeof selectedThumbnail === 'string' && <Image src={selectedThumbnail} alt='' className={'w-full h-auto'} />}
                        {selectedThumbnail && typeof selectedThumbnail === 'object' && <img src={URL.createObjectURL(selectedThumbnail)} alt='' className='w-full h-auto' />}
                        {!selectedThumbnail && <ModuleThumbnail
                            setThumbnail={setSelectedThumbnail}
                            setThumbnailError={setThumbnailError}
                        />}
                        {thumbnailError && <p className="text-sm mt-3 font-medium text-center text-red-500 ">{thumbnailError}</p>}
                        {errors?.thumbnail && <span className="mt-1 text-xs text-red-500">{errors.thumbnail}</span>}
                    </div>
                </div>
                <div className="md:w-1/2 max-md:pb-10">
                    <div className="flex flex-col gap-y-5">

                        <div className="">
                            <TextField
                                fullWidth
                                label='Name'
                                variant="outlined"
                                size="small"
                                value={moduleData.name}
                                type="text"
                                onChange={(e) => setModuleData({ ...moduleData, name: e.target.value })}
                            />
                            {errors?.name && <span className="mt-1 text-xs text-red-500">{errors.name}</span>}
                        </div>

                        <div>
                            <Textarea
                                placeholder="Description...."
                                value={moduleData.description}
                                onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                                minRows={2}
                                maxRows={4}
                                endDecorator={
                                    <small className="ml-auto">{moduleData.description.length} character(s)</small>
                                }
                                sx={{ minWidth: 300 }}
                            />
                            {errors?.description && <span className="mt-1 text-xs text-red-500">{errors.description}</span>}
                        </div>

                        <div className="">
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-select-small-label">Subject</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={moduleData.subject}
                                    label="Subject"
                                    onChange={(e) => setModuleData({ ...moduleData, subject: e.target.value })}
                                >
                                    <MenuItem value='All'>All</MenuItem>
                                    <MenuItem value='Reading'>Reading</MenuItem>
                                    <MenuItem value='Writing'>Writing</MenuItem>
                                    <MenuItem value='Speaking'>Speaking</MenuItem>
                                    <MenuItem value='Listening'>Listening</MenuItem>
                                </Select>
                            </FormControl>
                            {errors?.subject && <span className="mt-1 text-xs text-red-500">{errors.subject}</span>}
                        </div>

                        <div className="">
                            <TextField
                                fullWidth
                                label='Release Date'
                                variant="outlined"
                                size="small"
                                value={moduleData.releaseDate || ''}
                                InputLabelProps={{ shrink: true }}
                                type="datetime-local"
                                onChange={(e) => setModuleData({ ...moduleData, releaseDate: e.target.value })}
                                InputProps={{
                                    inputProps: { min: new Date().toISOString().slice(0, 16) },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {/* Add any desired icon or text */}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errors?.releaseDate && <span className="mt-1 text-xs text-red-500">{errors.releaseDate}</span>}
                        </div>

                        {errors?.formError && <p className="mt-1 text-xs text-center text-red-500">{errors.formError}</p>}

                        <div className="text-end">
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: 'capitalize',
                                    color: 'white',
                                    backgroundColor: '#1B3B7D',
                                    '&:hover': {
                                        backgroundColor: '#1B3B7D'
                                    }
                                }}
                                onClick={moduleId ? updateModule : addModuleHandle}
                            >
                                {moduleId ? 'Update Module' : 'Add Module'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AddModule;
