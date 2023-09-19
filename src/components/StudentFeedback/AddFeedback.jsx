import { Add, Close, Done } from "@mui/icons-material";
import { FormControl, IconButton, Modal, Select, TextField, InputLabel, MenuItem, Button, CircularProgress, LinearProgress } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReviewVideo from "./ReviewVideo";
import uploadToAWS from "../../aws/upload";
import feedbackApi from "../../api/feedback";
import { Country } from 'country-state-city';

const visaTypes = [
    "Tourist Visa (Visitor Visa)",
    "Student Visa",
    "Work Visa (Employment Visa)",
    "Business Visa",
    "Transit Visa",
    "Residence Visa (Permanent Visa)",
    "Family Reunion Visa",
    "Diplomatic Visa",
    "Official Visa",
    "Refugee Visa",
    "Asylum Visa",
    "Investor Visa",
    "Journalist Visa",
    "Crew Visa",
    "Volunteer Visa"
];


const AddFeedback = ({ open, close, refetch }) => {

    // states
    const [uploading, setUploading] = useState(false);
    const [uploadingToAWS, setUploadingToAWS] = useState({ uploading: false, progress: 0, success: false });

    // react-hook-form
    const { register, control, reset, formState: { errors }, handleSubmit } = useForm();

    // close function
    const handleClose = () => {
        if (uploading) {
            return;
        }
        setUploadingToAWS({ uploading: false, progress: 0, success: false });
        reset();
        close();
    }

    // upload to aws
    const uploadVideo = (file) => new Promise(async (resolve, reject) => {
        try {
            const result = await uploadToAWS(file, 'feedback', (event) => {
                setUploadingToAWS({ success: false, progress: Math.round((event.loaded * 100) / event.total), uploading: true });
            });
            setUploadingToAWS({ uploading: false, progress: 0, success: true });
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });

    // add handler
    const addHandler = async (data) => {
        const video = await uploadVideo(data.video);
        data.video = video.Key;
        setUploading(true);
        try {
            await feedbackApi.create(data);
            refetch();
            reset();
            setUploadingToAWS({ uploading: false, progress: 0, success: false });
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    }

    return (
        <Modal open={open} onClose={handleClose} className="grid place-items-center py-10 overflow-y-auto">
            <div className="!outline-none bg-white rounded-xl p-5 relative max-lg:w-[95%] lg:w-[800px] ">
                {/* close button */}
                <IconButton onClick={handleClose} className="!absolute !top-3 !right-3">
                    <Close />
                </IconButton>
                <form onSubmit={handleSubmit(addHandler)} className={`flex flex-col gap-5 ${(uploading || uploadingToAWS.uploading) && 'pointer-events-none'}`}>
                    <h1 className="text-2xl font-semibold">Add Student Review</h1>
                    <div className="grid lg:grid-cols-12 gap-5">
                        <div className="lg:col-span-4 max-lg:col-span-1">
                            <TextField
                                size="small"
                                fullWidth
                                type='text'
                                variant="outlined"
                                label="Student Name"
                                className="!text-sm"
                                InputLabelProps={{ className: '!text-sm !font-medium' }}
                                {...register('studentName', { required: 'Student name is required' })}
                            />
                            {errors['studentName'] && <span className="text-xs text-red-500 font-medium">{errors['studentName']?.message}</span>}
                        </div>
                        <div className="lg:col-span-4 max-lg:col-span-1">
                            <Controller
                                rules={{ required: 'Country is required' }}
                                name="country"
                                control={control}
                                render={({ field: { onChange, value } }) => <FormControl size='small' fullWidth>
                                    <InputLabel className="!text-sm" id="demo-simple-select-label">Country</InputLabel>
                                    <Select
                                        className="!text-sm"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={value || ''}
                                        label="Country"
                                        onChange={onChange}
                                        MenuProps={{ height: '70vh' }}
                                    >
                                        {Country.getAllCountries().map(({ name }) => <MenuItem className="!text-sm" key={name} value={name}>{name}</MenuItem>)}
                                    </Select>
                                </FormControl>}
                            />
                            {errors['country'] && <span className="text-xs text-red-500 font-medium">{errors['country']?.message}</span>}
                        </div>
                        <div className="lg:col-span-4 max-lg:col-span-1">
                            <Controller
                                rules={{ required: 'Visa Type is required' }}
                                name="visaType"
                                control={control}
                                render={({ field: { onChange, value } }) => <FormControl size='small' fullWidth>
                                    <InputLabel className="!text-sm" id="demo-simple-select-label">Visa Type</InputLabel>
                                    <Select
                                        className="!text-sm"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={value || ''}
                                        label="Visa Type"
                                        onChange={onChange}
                                        MenuProps={{ height: '70vh' }}
                                    >
                                        {visaTypes.map(visa => <MenuItem className="!text-sm" key={visa} value={visa}>{visa}</MenuItem>)}
                                    </Select>
                                </FormControl>}
                            />
                            {errors['visaType'] && <span className="text-xs text-red-500 font-medium">{errors['visaType']?.message}</span>}
                        </div>
                        <Controller
                            rules={{ required: 'Video is required' }}
                            name="video"
                            control={control}
                            render={({ field: { onChange, value } }) => <ReviewVideo
                                setVideo={onChange}
                                video={value || null}
                                formError={errors['video']?.message}
                            />}
                        />
                        <div className="lg:col-span-6">
                            <TextField
                                minRows={5}
                                size="small"
                                fullWidth
                                type='text'
                                variant="outlined"
                                label="Content"
                                multiline
                                className="!text-sm"
                                InputLabelProps={{ className: '!text-sm !font-medium' }}
                                {...register('content', { required: 'Content is required' })}
                            />
                            {errors['content'] && <span className="text-xs text-red-500 font-medium">{errors['content']?.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        {/* if file upload completed */}
                        {uploadingToAWS.success && <p className="text-sm font-medium flex gap-2 items-center text-green-500">
                            File upload completed
                            <Done />
                        </p>}

                        {/* circular loader */}
                        {uploading && <CircularProgress color="inherit" size={22} />}

                        {/* see progress bar upload video */}
                        {uploadingToAWS.uploading && <div className="flex flex-row w-full gap-4 items-center">
                            <LinearProgress variant="determinate" value={uploadingToAWS.progress} className="!w-full" />
                            <p className="text-sm font-medium">{uploadingToAWS.progress}%</p>
                        </div>}

                        {(uploading || uploadingToAWS?.uploading) && <p className="font-medium text-red-500 text-sm">Don't reload this page</p>}
                    </div>
                    <Button type="submit" variant="contained" disabled={uploading || uploadingToAWS.uploading} className="!py-2.5 !capitalize" startIcon={<Add />} >Add Review</Button>
                </form>
            </div>
        </Modal>
    );
}

AddFeedback.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    refetch: PropTypes.func,
};

export default AddFeedback;
