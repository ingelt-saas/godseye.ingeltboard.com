import { useState, useEffect } from "react";
// import LibraryApi from "../../api/Library";

// MUI Support
import {
    Box,
    CircularProgress,
    TablePagination,
    Typography,
    Alert,
    Button
} from "@mui/material";

//mux video

// Custom Components
import SearchBar from "../components/shared/SearchBar";
import libraryApi from "../api/library";
import getFile from "../api/getFile";

// Image
import pdf from "../assets/pdf.svg";
import audio from "../assets/audio.svg";
import video from "../assets/video.svg";
import csv from "../assets/csv.svg";
import doc from "../assets/doc.svg";
import AudioModal from "../components/shared/AudioModal";
import VideoModal from "../components/shared/VideoModal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../components/shared/DeleteConfirmModal";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import AddItem from "../components/Library/AddItem";
import EditModal from "../components/Library/EditModal";

const Library = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 0, rows: 10 });
    const [activeTab, setActiveTab] = useState(1);

    const [selectedFile, setSelectedFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(null);

    const openPopup = (file, link) => {
        setSelectedFile({ file, link });
        setShowPopup(true);
    };

    const closePopup = () => {
        setSelectedFile(null);
        setShowPopup(false);
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    const downloadItem = async (key) => {
        const res = await getFile(key);
        const extension = key.split('.').pop().toUpperCase();

        if (['PDF', 'DOC', 'DOCX', 'CSV'].includes(extension)) {
            window.open(res?.data, '_blank');
        } else {
            openPopup(key, res?.data);
        }
    };

    const { data: library, isLoading, refetch } = useQuery({
        queryKey: ['libraryItems', pagination, activeTab, searchQuery],
        queryFn: async () => {
            const subject = activeTab === 1 ? 'all' : (activeTab === 2 ? 'reading' : (activeTab === 3 ? 'writing' : (activeTab === 4 ? 'speaking' : 'listening')));
            const res = await libraryApi.read(
                subject,
                pagination.page + 1,
                pagination.rows,
                searchQuery
            );
            return res.data;
        }
    });

    // search library items
    const searchLibrary = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
        setPagination({ rows: 10, page: 0 });
    }

    // delete handler
    const deleteLibraryItem = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await libraryApi.delete(deleteConfirm.id);
            setDeleteConfirm(null);
            refetch();
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            e.target.disabled = false;
        }
    }

    function getFileType(fileName) {
        const extension = fileName?.split('.').pop().toUpperCase();
        if (['MP4', 'WEBM', 'OGG'].includes(extension)) {
            return 'Video';
        } else if (['WAV', 'FLAC', 'MP3'].includes(extension)) {
            return 'Audio';
        } else {
            return extension;
        }
    }

    function getFileImage(fileName) {
        const extension = fileName.split('.').pop().toUpperCase();
        if (['MP4', 'WEBM', 'OGG'].includes(extension)) {
            return video;
        } else if (['WAV', 'FLAC', 'MP3'].includes(extension)) {
            return audio;
        } else if (['CSV'].includes(extension)) {
            return csv;
        } else if (['DOC', 'DOCX'].includes(extension)) {
            return doc;
        } else if (['PDF'].includes(extension)) {
            return pdf;
        } else {
            return pdf;
        }
    }

    //   const handleContextMenu = (e) => {
    //     e.preventDefault(); // Prevent the default right-click behavior
    //   };

    return (
        <Box sx={
            {
                width: "100%",
                pr: { xl: 4, lg: 5 },
                pl: { xl: 0, lg: 5 }
            }
        }>

            <Box sx={
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: { md: "65%", xs: "100%" },
                    height: "20vh",
                    padding: "2rem",
                    backgroundColor: "white",
                    border: "1px solid white",
                    borderRadius: "2rem",
                    boxShadow: "0px 10px 36px rgba(0, 0, 0, 0.16), 0px 0px 0px 1px rgba(0, 0, 0, 0.06);"
                }
            }>
                <Box sx={
                    {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        flexDirection: "column",
                        width: { md: "50%", xs: "90%" }
                    }
                }>
                    <Typography sx={
                        {
                            color: "rgba(0, 0, 0, 0.6);",
                            display: { md: "flex", xs: "none" }
                        }

                    }>Welcome To</Typography>
                    <Typography sx={
                        {
                            fontWeight: "bold",
                            fontSize: "1.5rem"
                        }
                    }>InGelt Centralized Library</Typography>
                </Box>
            </Box>

            <Box sx={
                {
                    mt: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: "space-between", md: 'flex-start', lg: 'space-between' },
                    flexWrap: "wrap"
                }
            }>
                <div className="flex items-end justify-start">
                    <button onClick={
                        () => handleTabChange(1)
                    }
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 1 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>All</button>
                    <button onClick={
                        () => handleTabChange(2)
                    }
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 2 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Reading</button>
                    <button onClick={
                        () => handleTabChange(3)
                    }
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 3 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Writing</button>
                    <button onClick={
                        () => handleTabChange(4)
                    }
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 4 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Speaking</button>
                    <button onClick={
                        () => handleTabChange(5)
                    }
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 5 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Listening</button>
                </div>
                <div className="flex items-end justify-end pt-5 sm:pt-0 md:pl-16 xl:pl-0">
                    <SearchBar handleSubmit={searchLibrary} />
                </div>
                <div className=''>
                    <button
                        onClick={() => setAddModal(true)}
                        className='text-sm px-6 py-3 rounded-md shadow-md text-white bg-[#1B3B7D]'
                    >
                        Add Library Item
                    </button>
                </div>
            </Box>

            {isLoading && <div className="py-10 flex justify-center">
                <CircularProgress />
            </div>}

            {!isLoading && (Array.isArray(library?.rows) && library?.rows.length > 0 ? <div>
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-2 gap-y-5 pt-10">
                    {library?.rows.map((item, index) => (
                        <div className="flex flex-col items-center justify-center bg-white rounded-xl h-full 2xl:w-[19vw] xl:w-[18vw] lg:w-[28vw] shadow-[0px_10px_36px_rgba(0,0,0,0.16),0px_0px_0px_1px_rgba(0,0,0,0.06)] scale-95 hover:scale-100 duration-200 transition-transform hover:cursor-pointer"
                            key={index}
                            onClick={
                                () => downloadItem(item.file)
                            }>
                            <div className="h-[70%] flex flex-col items-center justify-center pb-4 pt-10">
                                <div className="flex">
                                    {<img src={getFileImage(item.file)} alt="" />}
                                </div>
                                <div>
                                    <p className="font-bold px-4 py-2">
                                        {
                                            item?.name
                                        }</p>
                                </div>
                            </div>
                            <hr className="w-full text-zinc-300" />
                            <div className="flex items-center justify-between w-full px-4 py-4">
                                <div>
                                    <p className="font-bold">File Type:</p>
                                    <p>{getFileType(item.file)}</p>
                                </div>
                                <div>
                                    <p className="bg-[#1B3B7D] text-white px-3 py-1 rounded-md">
                                        {
                                            item?.subject.slice(0, 1).toUpperCase()
                                        }</p>
                                </div>
                            </div>
                            <div className="pb-5 w-full px-5 flex flex-col gap-y-4">
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#1B3B7D',
                                        borderRadius: '7px',
                                        border: '2px solid #1B3B7D',
                                        textTransform: 'capitalize',
                                        width: '100%',
                                        '&:hover': {
                                            border: '2px solid #1B3B7D',
                                        }
                                    }}
                                    endIcon={<Edit />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditModal(item);
                                    }}
                                >Update</Button>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#1B3B7D',
                                        borderRadius: '7px',
                                        border: '2px solid #1B3B7D',
                                        textTransform: 'capitalize',
                                        width: '100%',
                                        '&:hover': {
                                            border: '2px solid #1B3B7D',
                                        }
                                    }}
                                    endIcon={<Delete />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm(item);
                                    }}
                                >Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <TablePagination component='div' color="primary"
                    count={library?.count}
                    rowsPerPageOptions={
                        [10, 25, 50, 100]
                    }
                    page={
                        pagination.page
                    }
                    rowsPerPage={
                        pagination.rows
                    }
                    onPageChange={
                        (_, newPage) => setPagination({
                            ...pagination,
                            page: newPage
                        })
                    }
                    onRowsPerPageChange={
                        (e) => setPagination({
                            ...pagination,
                            rows: e.target.value
                        })
                    }
                    className="mt-6"
                />

            </div> : <Alert severity="warning" icon={false} className=" mt-5 mx-auto w-fit text-xl font-semibold ">
                No Items Found
            </Alert>)
            }
            {selectedFile && selectedFile?.file?.toLowerCase().endsWith('.mp3') ? (
                <AudioModal file={selectedFile?.link} showPopup={showPopup} closePopup={closePopup} />
            ) : (
                <VideoModal file={selectedFile?.link} showPopup={showPopup} closePopup={closePopup} />
            )}

            {/* delete confirm modal  */}
            <DeleteConfirmModal
                open={Boolean(deleteConfirm)}
                data={deleteConfirm}
                confirmHandler={deleteLibraryItem}
                close={() => setDeleteConfirm(null)}
                name='library item'
            />

            {/* Add library item modal */}
            <AddItem
                open={addModal}
                close={() => setAddModal(false)}
                refetch={refetch}
            />

            {/* Edit library item modal */}
            <EditModal
                open={Boolean(editModal)}
                close={() => setEditModal(null)}
                refetch={refetch}
                item={editModal}
            />

        </Box>
    );
};

export default Library;
