import PropTypes from 'prop-types';
import { StudentImage } from '../Institutes/AppliedStudents';
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import moment from 'moment';

const StudentItem = ({ student, setStudentInfo, setDeleteConfirm }) => {
    return (
        <div onClick={() => setStudentInfo(student)} className='flex flex-col gap-y-4 border cursor-pointer border-[#E1E1E1] py-4 px-4 shadow-md bg-white items-start rounded-lg' key={student?.id}>
            <StudentImage student={student} />
            <div className="w-full flex-1">
                <table className="w-full !text-sm">
                    <tbody>
                        <tr>
                            <td className="font-semibold pr-2">
                                <span className="flex items-start justify-between w-full">Name<span>:</span></span>
                            </td>
                            <td>{student?.name}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold pr-2">
                                <span className="flex items-start justify-between w-full">Email<span>:</span></span>
                            </td>
                            <td>{student?.email}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold pr-2">
                                <span className="flex items-start justify-between w-full">Phone NO<span>:</span></span>
                            </td>
                            <td>{student?.phoneNo}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold pr-2">
                                <span className="flex items-start justify-between w-full">Gender<span>:</span></span>
                            </td>
                            <td>{student?.gender || 'Not Set'}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold pr-2">
                                <span className="flex items-start justify-between w-full">DOB<span>:</span></span>
                            </td>
                            <td>{student?.dob ? moment(student?.dob).format('ll') : 'Not Set'}</td>
                        </tr>
                        <tr>
                            <td className="font-semibold pr-2">
                                <span className="flex items-start justify-between w-full">Registered<span>:</span></span>
                            </td>
                            <td>{student?.createdAt ? moment(student?.createdAt).format('ll') : 'Not Set'}</td>
                        </tr>
                    </tbody>
                </table>
                {student?.organization && <p className="text-sm mt-2">Student of <strong>{student?.organization?.name}</strong></p>}
            </div>
            <Button
                variant="outlined"
                sx={{
                    color: '#1B3B7D',
                    borderRadius: '0.9rem',
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
                    setDeleteConfirm(student);
                }}
            >Delete</Button>
        </div>
    );
}

StudentItem.propTypes = {
    student: PropTypes.object,
    setStudentInfo: PropTypes.func,
    setDeleteConfirm: PropTypes.func
};

export default StudentItem;
