import { useState } from 'react';
import SearchBar from '../components/shared/SearchBar';
import { Alert, Box, Button, CircularProgress, TablePagination, Typography } from '@mui/material';

// assets 
import moduleImg from '../assets/module.svg';
import moduleApi from '../api/modules';
import Image from '../components/shared/Image';
import AudioModal from '../components/shared/AudioModal';
import VideoModal from '../components/shared/VideoModal';
import getFile from '../api/getFile';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';

const Modules = () => {

    const [activeTab, setActiveTab] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 0, rows: 10 });
    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();

    const { data: modules, isLoading, refetch } = useQuery({
        queryKey: ['modules', pagination, activeTab, searchQuery],
        queryFn: async () => {
            const subject = activeTab === 1 ? 'all' : (activeTab === 2 ? 'reading' : (activeTab === 3 ? 'writing' : (activeTab === 4 ? 'speaking' : 'listening')));
            const res = await moduleApi.read(subject, pagination.page + 1, pagination.rows, searchQuery);
            return res.data;
        }
    });


    const viewsShorten = (num) => {
        if (typeof num !== 'number') {
            return '0';
        }
        num = num?.toString().replace(/[^0-9.]/g, "");
        if (num < 1000) {
            return num;
        }
        let si = [
            { v: 1e3, s: "K" },
            { v: 1e6, s: "M" },
            { v: 1e9, s: "B" },
            { v: 1e12, s: "T" },
            { v: 1e15, s: "P" },
            { v: 1e18, s: "E" },
        ];
        let index;
        for (index = si.length - 1; index > 0; index--) {
            if (num >= si[index].v) {
                break;
            }
        }
        return (
            (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
            si[index].s
        );
    };

    const secondsToHoursMinutes = (seconds) => {
        const hours = Math.floor(seconds / 3600); // Number of whole hours
        const remainingSeconds = seconds % 3600; // Remaining seconds after calculating hours
        const minutes = Math.floor(remainingSeconds / 60); // Number of whole minutes
        return `${hours.toString().padStart(2, 0)} h ${minutes.toString().padStart(2, 0)} min`;

    }

    const handleView = async (key) => {
        const res = await getFile(key);
        setSelectedFile({ file: key, link: res.data });
    }

    const searchModules = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
        setPagination({ page: 0, rows: 5 });
    }

    // delete handler
    const deleteModule = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await moduleApi.delete(deleteConfirm.id);
            setDeleteConfirm(null);
            refetch();
        } catch (err) {
            console.error(err)
        } finally {
            e.target.disabled = false;
        }
    }

    return (
        <Box sx={
            {
                width: "100%",
                pr: { xl: 2, lg: 2 },
                pl: { xl: 0, lg: 2 }
            }
        }>

            <Box sx={
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "20vh",
                    padding: "2rem",
                    backgroundColor: "white",
                    border: "1px solid white",
                    borderRadius: "1rem",
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
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem"
                        }}>Recorded Lecture </Typography>
                    <Typography
                        sx={{
                            fontSize: '14px',
                            color: "rgba(0, 0, 0, 0.6);",
                            display: { md: "flex", xs: "none" }
                        }}
                    >Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor.  </Typography>
                </Box>
                <Box sx={
                    { width: { md: "60%", xs: "100%" } }
                }>
                    <img src={moduleImg}
                        alt="library"
                        className="h-full w-auto ml-auto" />
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
                    <button onClick={() => setActiveTab(1)}
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 1 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>All</button>
                    <button onClick={() => setActiveTab(2)}
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 2 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Reading</button>
                    <button onClick={() => setActiveTab(3)}
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 3 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Writing</button>
                    <button onClick={() => setActiveTab(4)}
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 4 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Speaking</button>
                    <button onClick={() => setActiveTab(5)}
                        className={
                            `duration-200 transition-none ease-in ${activeTab === 5 ? 'border-1 py-3 px-5 md:px-8 font-semibold text-[#1B3B7D] border-[#ECECEC] bg-white border-b-0 rounded-t-xl' : 'bg-[#F3F3F3] py-2 px-2 md:px-5 text-sm'
                            }`
                        }>Listening</button>
                </div>
                <div className="flex items-end justify-end pt-5 sm:pt-0 md:pl-16 xl:pl-0">
                    <SearchBar handleSubmit={searchModules} />
                </div>
                <div className=''>
                    <Link
                        to='/modules/add'
                        className='text-sm px-6 py-3 rounded-md shadow-md text-white bg-[#1B3B7D]'
                    >
                        Add Module
                    </Link>
                </div>
            </Box>


            {isLoading && <div className="py-10 flex justify-center">
                <CircularProgress />
            </div>}

            {!isLoading && (Array.isArray(modules?.rows) && modules?.rows?.length > 0 ? <Box className='mt-5'>
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-y-5 pt-10">
                    {modules?.rows.map((item, index) => (
                        <div onClick={() => item.file && handleView(item.file)} className="p-3 bg-white flex flex-col rounded-xl h-full shadow-[0px_10px_36px_rgba(0,0,0,0.16),0px_0px_0px_1px_rgba(0,0,0,0.06)] scale-95 hover:scale-100 duration-200 transition-transform cursor-pointer" key={index}>
                            <div className='rounded-2xl h-44 overflow-hidden'>
                                <Image src={item.thumbnail} alt={item.name} className='w-full h-full object-cover' />
                            </div>
                            <div className='mt-5 flex-col gap-y-3 flex flex-1'>
                                <h4 className='flex justify-between gap-x-3 items-start'>
                                    <span className='text-lg font-semibold text-[#00285A]'>{item.name}</span>
                                    {item.subject === 'Writing' && <span className='capitalize text-sm font-medium bg-[#85E1ED33] rounded-full text-[#355A5F] py-1 px-4 shadow-md'>{item.subject}</span>}
                                    {item.subject === 'Listening' && <span className='capitalize text-sm font-medium bg-[#FF898933] rounded-full text-[#663737] py-1 px-4 shadow-md'>{item.subject}</span>}
                                    {item.subject === 'Reading' && <span className='capitalize text-sm font-medium bg-[#0064E133] rounded-full text-[#0064E1] py-1 px-4 shadow-md'>{item.subject}</span>}
                                    {item.subject === 'Speaking' && <span className='capitalize text-sm font-medium bg-[#E19AF233] rounded-full text-[#5A3E61] py-1 px-4 shadow-md'>{item.subject}</span>}
                                </h4>
                                <p className='text-sm flex-1'>
                                    {item.description?.length > 90 ? item.description.split('').slice(0, 90).join('') + '...' : item.description}
                                </p>
                                <p className='flex items-center justify-between'>
                                    <span className='flex items-center text-[#00285A] gap-x-2 text-sm'>
                                        <svg
                                            width={16}
                                            height={16}
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8 0C12.4184 0 16 3.5816 16 8C16 12.4184 12.4184 16 8 16C3.5816 16 0 12.4184 0 8C0 3.5816 3.5816 0 8 0ZM7.256 4.4648C7.1079 4.4648 6.96587 4.52363 6.86115 4.62835C6.75643 4.73307 6.6976 4.8751 6.6976 5.0232V9.488C6.6976 9.7968 6.9472 10.0464 7.256 10.0464H11.7208C11.7959 10.0492 11.8707 10.0369 11.9409 10.0102C12.0111 9.98339 12.0751 9.94275 12.1292 9.89065C12.1833 9.83855 12.2264 9.77608 12.2558 9.70696C12.2852 9.63785 12.3003 9.56351 12.3003 9.4884C12.3003 9.41329 12.2852 9.33895 12.2558 9.26984C12.2264 9.20072 12.1833 9.13825 12.1292 9.08615C12.0751 9.03405 12.0111 8.99341 11.9409 8.96665C11.8707 8.93989 11.7959 8.92756 11.7208 8.9304H7.8136V5.0232C7.8136 4.87524 7.75488 4.73333 7.65033 4.62863C7.54578 4.52394 7.40396 4.46501 7.256 4.4648Z"
                                                fill="#00285A"
                                            />
                                        </svg>
                                        {secondsToHoursMinutes(item.duration)}
                                    </span>
                                    <span className='flex items-center text-[#00285A] gap-x-2 text-sm'>
                                        <svg
                                            width={16}
                                            height={16}
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.5 8C10.5 8.66304 10.2366 9.29893 9.76777 9.76777C9.29893 10.2366 8.66304 10.5 8 10.5C7.33696 10.5 6.70107 10.2366 6.23223 9.76777C5.76339 9.29893 5.5 8.66304 5.5 8C5.5 7.33696 5.76339 6.70107 6.23223 6.23223C6.70107 5.76339 7.33696 5.5 8 5.5C8.66304 5.5 9.29893 5.76339 9.76777 6.23223C10.2366 6.70107 10.5 7.33696 10.5 8Z"
                                                fill="#00285A"
                                            />
                                            <path
                                                d="M0 8C0 8 3 2.5 8 2.5C13 2.5 16 8 16 8C16 8 13 13.5 8 13.5C3 13.5 0 8 0 8ZM8 11.5C8.92826 11.5 9.8185 11.1313 10.4749 10.4749C11.1313 9.8185 11.5 8.92826 11.5 8C11.5 7.07174 11.1313 6.1815 10.4749 5.52513C9.8185 4.86875 8.92826 4.5 8 4.5C7.07174 4.5 6.1815 4.86875 5.52513 5.52513C4.86875 6.1815 4.5 7.07174 4.5 8C4.5 8.92826 4.86875 9.8185 5.52513 10.4749C6.1815 11.1313 7.07174 11.5 8 11.5Z"
                                                fill="#00285A"
                                            />
                                        </svg>
                                        {viewsShorten(item?.views)}{" "}
                                        Views
                                    </span>
                                </p>

                                <div className='flex gap-x-3'>
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
                                        // endIcon={<Delete />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/modules/add?id=${item.id}`);
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
                        </div>
                    ))
                    }
                </div>

                <TablePagination component='div' color="primary"
                    count={modules?.count}
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
                    className="mt-6" />
            </Box> :
                <Alert icon={false} severity='warning' className='w-fit mx-auto mt-5'>No Modules Found</Alert>
            )}

            {selectedFile && selectedFile?.file?.toLowerCase().endsWith('.mp3') ? (
                <AudioModal file={selectedFile?.link} showPopup={Boolean(selectedFile)} closePopup={() => setSelectedFile(null)} />
            ) : (
                <VideoModal file={selectedFile?.link} showPopup={Boolean(selectedFile)} closePopup={() => setSelectedFile(null)} />
            )}

            {/* delete confirm modal */}
            <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                confirmHandler={deleteModule}
                data={deleteConfirm}
                name={'module'}
                open={Boolean(deleteConfirm)}
            />

        </Box>
    );
}

export default Modules;
