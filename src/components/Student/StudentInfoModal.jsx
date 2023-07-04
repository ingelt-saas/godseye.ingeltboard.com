import { Close } from '@mui/icons-material';
import { IconButton, Modal } from '@mui/material';
import moment from 'moment';


const StudentInfoModal = ({ open, close, data }) => {
    return (
        <Modal open={open} onClose={close} className='grid place-items-center py-10 overflow-y-auto'>
            <div className='bg-white relative outline-none p-5 md:w-[650px] w-11/12'>
                <h3 className='text-xl font-medium flex justify-between items-center'>
                    {data.name} details
                    <IconButton className='' onClick={close}>
                        <Close />
                    </IconButton>
                </h3>
                <div className='mt-5'>
                    <table className="w-full !text-sm">
                        <tbody>
                            <tr>
                                <td className="font-semibold pr-2">
                                    <span className="flex items-start justify-between w-full">Name<span>:</span></span>
                                </td>
                                <td>{data?.name}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold pr-2">
                                    <span className="flex items-start justify-between w-full">Email<span>:</span></span>
                                </td>
                                <td>{data?.email}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold pr-2">
                                    <span className="flex items-start justify-between w-full">Gender<span>:</span></span>
                                </td>
                                <td>{data?.gender || 'Not Set'}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold pr-2">
                                    <span className="flex items-start justify-between w-full">DOB<span>:</span></span>
                                </td>
                                <td>{data?.dob ? moment(data?.dob).format('ll') : 'Not Set'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}

export default StudentInfoModal;
