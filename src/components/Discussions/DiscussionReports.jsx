import { Alert, IconButton, Modal } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import discussionApi from '../../api/discussion';
import { Close } from '@mui/icons-material';
import ProfileImage from '../shared/ProfileImage';
import moment from 'moment';

const DiscussionReports = ({ open, close, discussion }) => {

    const { data, isLoading } = useQuery({
        queryKey: ['discussionReports', discussion],
        queryFn: async () => {
            if (!discussion?.id) {
                return [];
            }
            const res = await discussionApi.getDiscussionReport(discussion.id);
            return res.data;
        }
    });

    console.log(data)

    return (
        <Modal open={open} onClose={close} className='grid place-items-center' >
            <div className='outline-none bg-white rounded-md w-[700px] max-md:w-11/12 relative max-h-[90vh] flex flex-col'>
                <IconButton onClick={close} className='!absolute top-2 right-2 !text-white'>
                    <Close />
                </IconButton>

                <div className='rounded-md py-3 shadow-md bg-[#001E43] text-[#f2f2f2]'>
                    <p className='text-sm px-5 pb-3'>{discussion?.message}</p>
                    <div className='pt-2 flex justify-between border-t border-[#f2f2f250] px-5'>
                        <div className='flex items-center gap-x-2'>
                            <ProfileImage src={discussion?.senderImage} gender={discussion?.senderGender} className={'w-10 h-10 object-cover rounded-full'} alt='' />
                            <div className='flex flex-col gap-y-1'>
                                <p className='text-sm font-medium'>{discussion?.senderName}</p>
                                <span className='flex gap-x-2'>
                                    <span className='capitalize text-xs font-light rounded-full bg-[#0e4383] px-2 py-1 text-white'>{discussion?.designation}</span>
                                    <span className='capitalize text-xs rounded-full font-semibold text-[#001E43] bg-[#f2f2f2] px-2 py-1'>{discussion?.senderCountry}</span>
                                </span>
                            </div>
                        </div>
                        <span className='text-xs'>{discussion?.createdAt && moment(discussion?.createdAt).format('lll')}</span>
                    </div>
                </div>

                {/* loading animation */}
                {isLoading && <div className="py-5 flex justify-center w-full">
                    <svg width="100" height="100" viewBox="0 0 200 200">
                        <circle
                            cx="100"
                            cy="100"
                            r="50"
                            fill="none"
                            stroke="#001E43"
                            strokeWidth="4"
                        >
                            <animate
                                attributeName="r"
                                values="50; 30; 50"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="stroke-width"
                                values="4; 8; 4"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                </div>}

                <div className='flex-1 w-full px-5 py-5 overflow-y-auto'>
                    {!isLoading && (Array.isArray(data) && data.length > 0 ? <div className=''>
                        <div className='flex flex-col gap-y-4'>
                            {data.map(item => <div key={item?.id} className='shadow-lg rounded-md py-2 px-2 flex justify-between items-center'>
                                <div className='flex items-center gap-x-2'>
                                    <ProfileImage src={item.reporterImage} gender={item.reporterGender} className={'w-10 h-10 object-cover rounded-full'} alt='' />
                                    <div className='flex flex-col gap-y-1'>
                                        <p className='text-base font-medium'>{item.reporterName}</p>
                                        <span className='flex gap-x-2'>
                                            <span className='capitalize text-xs font-light rounded-full bg-[#001E43] px-2 py-1 text-white'>{item.reporterDesignation}</span>
                                            <span className='capitalize text-xs rounded-full font-semibold text-[#001E43] bg-[#f2f2f2] px-2 py-1'>{item.reporterCountry}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    </div> :
                        <Alert severity='warning' icon={false} className='mx-auto w-fit'>No Reports Found</Alert>
                    )}

                </div>
            </div>
        </Modal>
    );
}

export default DiscussionReports;
