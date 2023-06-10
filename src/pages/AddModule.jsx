import { Textarea } from "@mui/joy";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import modulesApi from "../api/modules";

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
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');

    const onDrop = useCallback((acceptFile, rejectFile) => {
        if (rejectFile.length > 0) {
            setModuleError('File type not supported');
        } else {
            setModuleError('');
            setSelectedModule(acceptFile[0]);
        }
    });

    const { getInputProps, getRootProps } = useDropzone({ onDrop, accept: { 'video/*': [] }, multiple: false });

    const getVideoDuration = (file) => new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file)
        video.onloadedmetadata = () => {
            resolve(video.duration);
        }
    });

    const addModuleHandle = async (e) => {

        if (!selectedModule) {
            toast.error('Select module video');
            return;
        }
        if (!selectedThumbnail) {
            toast.error('Select module thumbnail');
            return;
        }
        if (!description) {
            toast.error('Enter module description');
            return;
        }
        if (!subject) {
            toast.error('Select subject');
            return;
        }
        e.target.disabled = true;
        const duration = await getVideoDuration(selectedModule);
        const formData = new FormData();
        formData.append('file', selectedModule);
        formData.append('thumbnail', selectedThumbnail);
        formData.append('subject', subject);
        formData.append('description', description);
        formData.append('duration', duration);

        try {
            await modulesApi.create(formData);
            toast.success('Module added successfully');
            setSelectedModule(null);
            setSelectedThumbnail(null);
            setDescription('');
            setSubject('');
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            e.target.disabled = false;
        }

    }

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Add Module</h1>
            <div className="flex gap-x-5 max-md:flex-col max-md:gap-y-5 mt-10">
                <div className="md:w-1/2">
                    <div className="w-full">
                        {selectedModule && <ReactPlayer
                            url={URL.createObjectURL(selectedModule)}
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
                        {selectedThumbnail && <img src={URL.createObjectURL(selectedThumbnail)} alt='' className='w-full h-auto' />}
                        {!selectedThumbnail && <ModuleThumbnail
                            setThumbnail={setSelectedThumbnail}
                            setThumbnailError={setThumbnailError}
                        />}
                        {thumbnailError && <p className="text-sm mt-3 font-medium text-center text-red-500 ">{thumbnailError}</p>}
                    </div>
                </div>
                <div className="md:w-1/2">
                    <div>
                        <div>
                            <Textarea
                                placeholder="Description...."
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                minRows={2}
                                maxRows={4}
                                endDecorator={
                                    <small className="ml-auto">{description.length} character(s)</small>
                                }
                                sx={{ minWidth: 300 }}
                            />
                        </div>
                        <div className="mt-5">
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-select-small-label">Subject</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={subject}
                                    label="Subject"
                                    onChange={(e) => setSubject(e.target.value)}
                                >
                                    <MenuItem value='All'>All</MenuItem>
                                    <MenuItem value='Reading'>Reading</MenuItem>
                                    <MenuItem value='Writing'>Writing</MenuItem>
                                    <MenuItem value='Speaking'>Speaking</MenuItem>
                                    <MenuItem value='Listening'>Listening</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="mt-3 text-end">
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
                                onClick={addModuleHandle}
                            >
                                Add Module
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddModule;
