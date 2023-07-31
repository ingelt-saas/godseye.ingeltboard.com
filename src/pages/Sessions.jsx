import { useQuery } from '@tanstack/react-query';
import sessionApi from '../api/session';
import { Button, CircularProgress, IconButton, Popover } from '@mui/material';
import ProfileImage from '../components/shared/ProfileImage';
import moment from 'moment';
import { Close, Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddSession from '../components/Sessions/AddSession';

const DescPopup = ({ data, updateHandler }) => {

    const [description, setDescription] = useState(data?.desc || '');

    return <PopupState variant='popover' popupId="demo-popup-popover">
        {(popupState) => <>
            <IconButton {...bindTrigger(popupState)} className='opacity-0 group-hover:opacity-100 duration-500 !absolute !top-0 !right-0 translate-y-1/2'>
                <Edit fontSize='small' />
            </IconButton>
            <Popover
                PaperProps={{ className: '!rounded-2xl shadow-2xl bg-white' }}
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <div className='p-4 z-50 bg-white w-[300px] relative'>
                    <IconButton className='!absolute !top-2 !right-2' onClick={popupState.close}>
                        <Close />
                    </IconButton>
                    <h4 className='text-base font-semibold'>{data?.desc ? 'Update Description' : 'Set Description'}</h4>
                    <textarea
                        className='resize-none border-2 rounded-lg focus:outline-none px-1 my-2 w-full py-1 text-sm min-h-[100px]'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <Button
                        onClick={() => updateHandler(data?.id,
                            { desc: description },
                            'Description updated',
                            () => popupState.close()
                        )}
                        disabled={Boolean(!description) || (description && description === data?.desc)}
                        variant='contained'
                        className='!capitalize'
                        sx={{
                            fontWeight: 500,
                            padding: '0.3rem 2rem',
                        }}
                    >{data?.desc ? 'Update' : 'Set'}</Button>
                </div>
            </Popover>
        </>}
    </PopupState>
}

const TitlePopup = ({ data, updateHandler }) => {

    const [title, setTitle] = useState(data?.title || '');

    return <PopupState variant='popover' popupId="demo-popup-popover">
        {(popupState) => <>
            <IconButton {...bindTrigger(popupState)} className='opacity-0 group-hover:opacity-100 duration-500 !absolute !top-0 !right-0 translate-y-1/2'>
                <Edit fontSize='small' />
            </IconButton>
            <Popover
                PaperProps={{ className: '!rounded-2xl shadow-2xl bg-white' }}
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <div className='p-4 z-50 bg-white w-[300px] relative'>
                    <IconButton className='!absolute !top-2 !right-2' onClick={popupState.close}>
                        <Close />
                    </IconButton>
                    <h4 className='text-base font-semibold'>{data?.title ? 'Update Title' : 'Set Title'}</h4>
                    <textarea
                        className='resize-none border-2 rounded-lg focus:outline-none px-1 my-2 w-full py-1 text-sm min-h-[100px]'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    ></textarea>
                    <Button
                        onClick={() => updateHandler(data?.id,
                            { title: title },
                            'Title updated',
                            () => popupState.close()
                        )}
                        disabled={Boolean(!title) || (title && title === data?.title)}
                        variant='contained'
                        className='!capitalize'
                        sx={{
                            fontWeight: 500,
                            padding: '0.3rem 2rem',
                        }}
                    >{data?.title ? 'Update' : 'Set'}</Button>
                </div>
            </Popover>
        </>}
    </PopupState>
}

const Schedule = ({ schedule, sessionId, updateHandler }) => {

    const [date, setDate] = useState(schedule ? new Date(schedule) : null);

    const isDateMatch = moment(schedule).isSame(date);

    return <DatePicker
        className='focus:outline-none text-center whitespace-nowrap'
        selected={date}
        onChange={(dt) => setDate(dt)}
        onCalendarClose={() => !isDateMatch && updateHandler(sessionId, date)}
        placeholderText={'Click to set schedule'}
        timeIntervals={15}
        showTimeSelect={true}
        minDate={new Date()}
        dateFormat="MMM d, yyyy h:mm aa"
    />
}


const Sessions = () => {

    // states
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // fetch sessions
    const { data: sessions, isLoading, refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await sessionApi.getAll();
            return res.data;
        }
    });

    // delete session
    const deleteSession = async (e) => {
        if (!deleteConfirm) {
            return;
        }

        e.target.disabled = true;
        try {
            await sessionApi.delete(deleteConfirm?.id);
            toast.success('Session deleted');
            setDeleteConfirm(null);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            e.target.disabled = false;
        }
    }

    // update session
    const updateSession = async (sessionId, updateData, successMessage, closePopup = null,) => {
        try {
            await sessionApi.update(sessionId, updateData);
            typeof closePopup === 'function' && closePopup();
            toast.success(successMessage);
            refetch();
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className="px-5">
            <div className='flex justify-between items-center border-b py-2 px-5'>
                <h1 className="text-3xl font-medium">Sessions</h1>
                <Button
                    onClick={() => setIsOpen(true)}
                    variant='contained'
                    className='!capitalize !font-medium !text-sm !py-3'
                >Add Session</Button>
            </div>
            <div className='mt-10'>
                {isLoading && <div className='flex justify-center py-5'>
                    <CircularProgress />
                </div>}

                {!isLoading && (Array.isArray(sessions) && sessions.length > 0 ?
                    <table className='w-full text-xs bg-white'>
                        <thead className='bg-white !rounded-t-lg overflow-hidden'>
                            <tr>
                                <th className='px-2 py-3 text-center border-b'></th>
                                <th className='px-2 py-3 text-center border-b'>Email</th>
                                <th className='px-2 py-3 text-center border-b'>Phone No</th>
                                <th className='px-2 py-3 text-center border-b'>Title</th>
                                <th className='px-2 py-3 text-center border-b'>Description</th>
                                <th className='px-2 py-3 text-center border-b'>Schedule</th>
                                <th className='px-2 py-3 text-center border-b'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(item => <tr key={item.id}>
                                <td className='px-2 py-3 border-b whitespace-nowrap'>
                                    <div className='flex items-center gap-x-3 whitespace-nowrap w-full'>
                                        <ProfileImage src={item?.student?.image} gender={item?.student?.gender} className='w-10 aspect-square rounded-full' />
                                        <span className='flex-1 flex flex-col'>
                                            <span className='font-medium'>{item?.student?.name}</span>
                                            <span className='text-black font-medium opacity-70'>{item?.student?.id}</span>
                                        </span>
                                    </div>
                                </td>
                                <td className='px-2 py-3 text-center border-b whitespace-nowrap'>{item?.student?.email}</td>
                                <td className='px-2 py-3 text-center border-b whitespace-nowrap'>{item?.student?.phoneNo}</td>
                                <td className='px-2 py-3 text-center border-b whitespace-pre-line relative group pl-5'>
                                    {item?.title ? item?.title.split('').slice(0, 40).join('') + '..' : 'Not Set'}
                                    <TitlePopup data={item} updateHandler={updateSession} />
                                </td>
                                <td className='px-2 py-3 text-center border-b whitespace-pre-wrap relative group pl-5'>
                                    {item?.desc ? item?.desc.split('').slice(0, 40).join('') + '..' : 'Not Set'}
                                    <DescPopup data={item} updateHandler={updateSession} />
                                </td>
                                <td className='px-2 py-3 text-center border-b'>
                                    <Schedule
                                        schedule={item?.schedule}
                                        sessionId={item?.id}
                                        updateHandler={(sessionId, date) => updateSession(sessionId, { schedule: date }, 'Schedule updated')}
                                    />
                                </td>
                                <td className='px-2 py-3 text-center border-b'>
                                    <IconButton onClick={() => setDeleteConfirm({ name: item?.student?.name, id: item?.id })}>
                                        <Delete fontSize='small' />
                                    </IconButton>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                    :
                    <p className='text-center mx-auto text-red-500 font-medium'>No Item Found</p>
                )}
            </div>

            {/* delete confirm modal */}
            <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                open={Boolean(deleteConfirm)}
                data={deleteConfirm}
                confirmHandler={deleteSession}
                name={'session'}
            />

            {/* session add modal */}
            <AddSession open={isOpen} close={() => setIsOpen(false)} refetch={refetch} />

        </div >
    );
}

export default Sessions;
