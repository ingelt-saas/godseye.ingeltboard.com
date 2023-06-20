import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import studentApi from "../../api/student";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import getFile from "../../api/getFile";
import moment from "moment";
import { toast } from "react-toastify";

const StudentImage = ({ student, className }) => {

    const [url, setUrl] = useState(null);

    const generateImageFromName = (name) => {
        if (!name) {
            return '';
        }
        name = name.split(' ');
        let fname = name[0];
        let lname = name[1];
        name = lname ? fname?.charAt(0) + lname?.charAt(0) : fname?.charAt(0);
        return name.toUpperCase();
    }

    useEffect(() => {
        if (student.image) {
            getFile(student.image)
                .then(res => setUrl(res.data));
        }
    }, [student]);

    return url ?
        <img src={url} alt={student.name} className="w-20 h-20 rounded-full object-cover" /> :
        <div className="w-20 h-20 rounded-full text-3xl uppercase grid bg-[#1B3B7D] text-white place-items-center">
            {generateImageFromName(student.name)}
        </div>
}

const StudentItem = ({ student, acceptStudent }) => {

    return <div className='border border-[#E1E1E1] py-4 px-4 shadow-md bg-white flex flex-col items-start rounded-lg'>
        <StudentImage student={student.student} />
        <div className="w-full mt-2">
            <table className="w-full !text-sm">
                <tbody>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Name<span>:</span></span>
                        </td>
                        <td>{student?.student?.name}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Email<span>:</span></span>
                        </td>
                        <td>{student?.student?.email}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Gender<span>:</span></span>
                        </td>
                        <td>{student?.student?.gender}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">DOB<span>:</span></span>
                        </td>
                        <td>{student?.student?.dob && moment(student?.student?.dob).format('ll')}</td>
                    </tr>
                </tbody>
            </table>
            <p className="text-sm mt-2">Applied on <strong>{student?.organization?.name}</strong></p>
        </div>
        {student.status === 'applied' ? <Button
            variant='contained'
            onClick={(e) => acceptStudent(e, student.id, student?.student?.name)}
            sx={{
                mt: 2,
                width: '100%',
                borderRadius: 2,
                border: '2px solid #1B3B7D',
                color: 'white',
                backgroundColor: '#1B3B7D',
                fontWeight: 600,
                textTransform: 'capitalize',
                '&:hover': {
                    backgroundColor: '#1B3B7D'
                }
            }}
        > Accept</Button>
            : <p className="text-sm w-full mt-4 font-semibold border-2 border-[#1B3B7D] text-center py-2 rounded-md">Accepted</p>}
    </div>
}


const AppliedStudents = () => {

    const [pagination, setPagination] = useState({ page: 1, rows: 30 });
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['appliedStudents', pagination, searchQuery],
        queryFn: async () => {
            const res = await studentApi.appliedStudents(pagination.page, pagination.rows, searchQuery);
            return res.data;
        }
    });

    const acceptStudent = async (e, id, studentName) => {
        e.target.disabled = true;
        try {
            await studentApi.acceptStudent(id);
            toast.success(`${studentName} accepted`);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            e.target.disabled = false;
        }
    }

    return (
        <div className="px-5 mt-10">
            <h1 className="text-xl border-b-2 pb-2">Applied Students</h1>
            {isLoading && <div className="mt-5 flex justify-center">
                <CircularProgress />
            </div>}
            {!isLoading && (Array.isArray(data?.rows) && data?.rows?.length > 0 ?
                <div className="mt-5 grid grid-cols-3 gap-5">
                    {data?.rows.map(student => <StudentItem acceptStudent={acceptStudent} student={student} key={student.id} />)}
                </div>
                : <div className="mt-5"><Alert icon={false} severity="warning" className="mx-auto w-fit">No Students Found</Alert></div>
            )}
        </div>
    );
}

export default AppliedStudents;
