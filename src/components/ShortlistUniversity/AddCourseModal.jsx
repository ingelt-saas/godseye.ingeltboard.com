import { Close } from '@mui/icons-material';
import { IconButton, Modal } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

const AddCourseModal = ({ open, close, courseId }) => {

    const [course, setCourse] = useState(null);

    useEffect(() => {
        if (courseId) {
            // ()();
        } else {
            setCourse(null);
        }
    }, [courseId]);

    return (
        <Modal open={open} onClose={close} className='grid place-items-center' >
            <div className='bg-white outline-none rounded-md py-8 px-5 md:w-[700px] relative'>
                <IconButton className='!absolute top-3 right-3'>
                    <Close />
                </IconButton>
                <h1 className='text-center text-2xl font-medium pb-2 border-b'>
                    {course ? `Update ${course?.name}` : 'Add Course'}
                </h1>
                <div className='mt-5 grid grid-cols-2'>

                </div>
            </div>
        </Modal>
    );
}

export default AddCourseModal;
