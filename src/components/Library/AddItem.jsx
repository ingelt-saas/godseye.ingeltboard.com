import { Close } from "@mui/icons-material";
import { Button, FormControl, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import libraryApi from "../../api/library";

const AddItem = ({ open, close, refetch }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [typeError, setTypeError] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback((acceptFile, rejectFile) => {
        if (rejectFile.length > 0) {
            setTypeError('File type not supported');
        } else {
            setTypeError('');
            setSelectedFile(acceptFile[0]);
        }
    });

    const { getInputProps, getRootProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf', '.doc', '.docs', '.csv'],
            'video/mp4': ['.mp4', '.webm', '.ogg'],
            'audio/mp3': ['.wav', '.flac', '.mp3'],
        },
        multiple: false,
    });

    // file size converted , bytes into kb, mb, gb, tb
    const fileSize = (size) => {
        if (typeof size !== "number") {
            return "";
        }
        let units = ["B", "KB", "MB", "GB", "TB"],
            bytes = size,
            i;

        for (i = 0; bytes >= 1024 && i < 4; i++) {
            bytes /= 1024;
        }

        return bytes.toFixed(2) + " " + units[i];
    };
    const handleClose = () => {
        if (loading) {
            return;
        }
        setSelectedFile(null);
        setSubject('');
        setTypeError('');
        close();
    }

    // library item handler
    const addHandler = async (e) => {
        if (!selectedFile) {
            toast.error('Please select file');
            return;
        }
        if (!subject) {
            toast.error('Please select subject');
            return;
        }
        e.target.disabled = true;
        setLoading(true);
        const toastId = toast.loading('Uploading.....');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('subject', subject);
        try {
            await libraryApi.create(formData);
            toast.success('Library item uploaded');
            handleClose();
            refetch();
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
            e.target.disabled = false;
        }
    }

    return (
        <Modal open={open} onClose={handleClose} className="grid place-items-center">
            <div className="bg-white rounded-xl p-4 sm:w-[500px]">
                <h2 className="pb-2 border-b text-xl font-medium">Add library item</h2>
                <div className="">
                    {!selectedFile && <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="bg-[#f2f2f2] opacity-80 cursor-pointer border-2 text-center border-dashed border-[#1B3B7D] py-10">
                            <p>Drag 'n' drop item here, or click to select item</p>
                            <p className="text-sm opacity-75">Accept .mp4, .webm, .ogg, .wav, .flac, .mp3, .csv, .doc, .docs, .pdf</p>
                        </div>
                    </div>}
                    {selectedFile && <div className="border-2 py-3 px-3 flex items-start">
                        <div className="flex-1">
                            <h3 className="!text-base font-semibold text-[#1B3B7D]">{selectedFile?.name}</h3>
                            <span className="text-xs text-[#00000066] font-semibold">{fileSize(selectedFile?.size)}</span>
                        </div>
                        <button onClick={() => setSelectedFile(null)}>
                            <Close />
                        </button>
                    </div>}
                    {typeError && <span className="text-center text-xs block mt-3 font-medium text-red-500">{typeError}</span>}
                    <div className="mt-4">
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
                    <div className='flex items-center justify-end flex-row gap-x-4 mt-4'>
                        <Button
                            onClick={handleClose}
                            sx={{
                                color: '#00000066',
                                border: '2px solid #00000066',
                                fontWeight: 600,
                                padding: '0.5rem 2rem',
                                borderRadius: '7px',
                                textTransform: 'capitalize',
                                boxShadow: 'none'
                            }}
                        >Cancel</Button>
                        <Button
                            onClick={addHandler}
                            variant='contained'
                            sx={{
                                fontWeight: 600,
                                padding: '0.5rem 2rem',
                                border: '2px solid #1B3B7D',
                                backgroundColor: '#1B3B7D',
                                borderRadius: '7px',
                                textTransform: 'capitalize',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#1B3B7D',
                                }
                            }}
                        >Add</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddItem;
