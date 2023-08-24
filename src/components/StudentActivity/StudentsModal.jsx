import { Close, RemoveRedEye } from '@mui/icons-material';
import { CircularProgress, IconButton, Modal } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import studentActivityApi from '../../api/studentActivity';
import Image from '../shared/Image';
import { Link } from 'react-router-dom';

const StudentsModal = ({ open, close, date }) => {

    // states
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (date) {
            (async () => {
                try {
                    const res = await studentActivityApi.getStudentsByDate(date);
                    setStudents(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [date]);

    return (
        <Modal open={open} onClose={close} className='!grid !place-items-center overflow-y-auto'>
            <div className='outline-none bg-white p-5 max-w-[95vw] min-w-[500px] max-h-[90vh] flex flex-col'>
                <div className='flex justify-between items-center'>
                    <span className='text-xl font-semibold'>{moment(date).format('ll')}</span>
                    <IconButton onClick={close}>
                        <Close />
                    </IconButton>
                </div>
                <div className='flex-1'>
                    {loading && <div className='py-5 flex justify-center'>
                        <CircularProgress color='inherit' size={16} />
                    </div>}

                    {!loading && (Array.isArray(students) && students.length > 0 ?
                        <div className='h-full overflow-y-auto py-3'>
                            <div className='flex flex-col gap-4'>
                                {students.map(student => <div key={student.id} className='flex items-center justify-between shadow-md py-1 px-3 rounded-md border'>
                                    <div className='flex gap-3 items-center'>
                                        <div className='w-12 h-12 rounded-full overflow-hidden'>
                                            <Image src={student.image} alt={student.name} className={'w-full h-full object-cover'} />
                                        </div>
                                        <div className='flex flex-col gap-0'>
                                            <p className='font-semibold'>{student?.name}</p>
                                            <span className='text-sm'>{student?.email}</span>
                                        </div>
                                    </div>
                                    <Link to={`/student-activity/${student.id}`}>
                                        <IconButton>
                                            <RemoveRedEye />
                                        </IconButton>
                                    </Link>
                                </div>)}
                            </div>
                        </div>
                        : <p className='text-sm text-center py-4 text-red-500'>No Students Found</p>
                    )}

                </div>
            </div>
        </Modal>
    );
}


StudentsModal.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    date: PropTypes.string,
};


export default StudentsModal;
