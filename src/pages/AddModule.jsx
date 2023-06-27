import { ListItemButton, Textarea } from "@mui/joy";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment, CircularProgress, LinearProgress } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import modulesApi from "../api/modules";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Image from "../components/shared/Image";
import getFile from "../api/getFile";
import moment from 'moment';
import uploadToAWS from "../aws/upload";

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
    const [loading, setLoading] = useState(false);
    const [videoProgress, setVideoProgress] = useState(null);
    const [imageProgress, setImageProgress] = useState(null);
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

    // upload to aws s3 | module thumbnail & module video
    const uploadVideoAndThumbnail = (video, image) => new Promise(async (resolve, reject) => {
        try {
            let result = { video: null, image: null };
            if (image) {
                const uploadedImage = await uploadToAWS(image, 'ingelt/modules/thumbnails', (event) => {
                    setImageProgress(Math.round((event.loaded * 100) / event.total));
                });
                result.image = uploadedImage;
            }

            // Math.floor(current / total * 100)
            if (video) {
                const uploadedVideo = await uploadToAWS(video, 'ingelt/modules/videos', (event) => {
                    setVideoProgress(Math.round((event.loaded * 100) / event.total))
                });
                result.video = uploadedVideo;
            }
            resolve(result);
        } catch (err) {
            reject(err);
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

        // upload to aws
        const uploadedFiles = await uploadVideoAndThumbnail(
            selectedModule && selectedModule || null,
            selectedThumbnail && selectedThumbnail || null,
        );

        setLoading(true);
        e.target.disabled = true;
        const formData = {};

        if (selectedModule) {
            const duration = await getVideoDuration(selectedModule);
            formData.file = uploadedFiles.video.Key;
            formData.fileSize = selectedModule.size;
            formData.duration = duration;
        }

        formData.thumbnail = uploadedFiles.image.Key;
        formData.subject = moduleData.subject;
        formData.description = moduleData.description;
        formData.name = moduleData.name;

        if (moduleData.releaseDate) {
            formData.releaseDate = moduleData.releaseDate;
        }

        try {
            await modulesApi.create(formData);
            toast.success('Module added successfully');
            setSelectedModule(null);
            setSelectedThumbnail(null);
            setModuleData({ name: '', description: '', subject: '', releaseDate: null });
            setImageProgress(null);
            setVideoProgress(null);
        } catch (err) {
            console.log(err)
            toast.error('Sorry! Something went wrong');
        } finally {
            setLoading(false);
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


        setLoading(true);
        e.target.disabled = true;
        const formData = {};

        if ((selectedModule && typeof selectedModule === 'object') || selectedThumbnail && typeof selectedThumbnail === 'object') {


            const videoForUpload = typeof selectedModule === 'object' ? selectedModule : null;
            const imageForUpload = typeof selectedThumbnail === 'object' ? selectedThumbnail : null;

            // upload to aws
            const uploadedFiles = await uploadVideoAndThumbnail(videoForUpload, imageForUpload);

            if (videoForUpload) {
                const duration = await getVideoDuration(selectedModule);
                formData.file = uploadedFiles.video.Key;
                formData.fileSize = selectedModule.size;
                formData.duration = duration;
            }

            if (imageForUpload) {
                formData.thumbnail = uploadedFiles.image.Key;
            }

        }

        formData.subject = moduleData.subject;
        formData.description = moduleData.description;
        formData.name = moduleData.name;

        if (moduleData.releaseDate) {
            formData.releaseDate = moduleData.releaseDate;
        }

        const toastId = toast.loading('Updating...');

        try {
            await modulesApi.update(moduleId, formData);
            toast.success('Module update successfully');
            setImageProgress(null);
            setVideoProgress(null);
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
            e.target.disabled = false;
        }

    }

    useEffect(() => {
        if (moduleId) {
            modulesApi.readById(moduleId)
                .then(res => {
                    const getModule = res.data;
                    setModuleData({ ...getModule, releaseDate: moment(getModule.releaseDate).format('YYYY-MM-DDTHH:mm') });
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
                                value={moduleData.releaseDate ? moment(moduleData.releaseDate).format('YYYY-MM-DDTHH:mm') : ''}
                                InputLabelProps={{ shrink: true }}
                                type="datetime-local"
                                onChange={(e) => setModuleData({ ...moduleData, releaseDate: e.target.value })}
                                InputProps={{
                                    inputProps: { min: moment(new Date()).format('YYYY-MM-DDTHH:mm') },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {/* Add any desired icon or text */}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errors?.releaseDate && <span className="mt-1 text-xs text-red-500">{errors.releaseDate}</span>}
                        </div>

                        {videoProgress !== null && <div className={`flex flex-col gap-y-1 px-4 ${videoProgress >= 100 && 'bg-green-200'} py-3`}>
                            <p className={`!text-sm font-medium ${imageProgress < 100 ? 'text-black' : 'text-green-600'}`}>Module Video {videoProgress < 100 ? 'Uploading' : 'Uploaded'}</p>
                            <LinearProgress variant="determinate" value={videoProgress} />
                        </div>}

                        {imageProgress !== null && <div className={`flex flex-col gap-y-1 px-4 ${imageProgress >= 100 && 'bg-green-200'} py-3`}>
                            <p className={`!text-sm font-medium ${imageProgress < 100 ? 'text-black' : 'text-green-600'}`}>Module Thumbnail {imageProgress < 100 ? 'Uploading' : 'Uploaded'}</p>
                            <LinearProgress variant="determinate" value={imageProgress} />
                        </div>}

                        {/* {loading && <div className="flex flex-col gap-y-5 items-center">
                            <CircularProgress />
                            <p className="text-center text-sm text-yellow-700">Don't reload this page</p>
                        </div>} */}

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
