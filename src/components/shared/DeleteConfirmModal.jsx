import { Button, Modal } from '@mui/material';
import React from 'react';

//assets
import deleteImg from '../../assets/delete-file.svg';

const DeleteConfirmModal = ({ open, data, close, confirmHandler, name }) => {
    return (
        <Modal open={open} onClose={close} className='grid place-items-center'>
            <div className='bg-white pb-7 pt-4 px-7 rounded-md'>
                <img src={deleteImg} alt='Delete' className='mx-auto mb-3' />
                <h4 className='text-xl font-medium text-center'>Are you sure you want to delete <br /> this {name}?</h4>
                <h4 className='text-2xl mt-3 text-center text-[#00000099] font-medium'>"{data?.name || 'file'}"</h4>
                <div className='flex items-center flex-row gap-x-4 mt-4'>
                    <Button
                        onClick={close}
                        sx={{
                            color: '#00000066',
                            border: '1px solid #00000066',
                            fontWeight: 600,
                            padding: '0.7rem',
                            borderRadius: '7px',
                            textTransform: 'capitalize',
                            flex: '1',
                            boxShadow: 'none'
                        }}
                    >Cancel</Button>
                    <Button
                        onClick={confirmHandler}
                        color='error' variant='contained'
                        sx={{
                            fontWeight: 600,
                            padding: '0.7rem',
                            borderRadius: '7px',
                            textTransform: 'capitalize',
                            flex: '1',
                            boxShadow: 'none'
                        }}
                    >Delete</Button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteConfirmModal;
