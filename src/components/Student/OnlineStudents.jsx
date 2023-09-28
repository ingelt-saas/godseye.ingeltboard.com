import { useEffect, useState } from "react";
import { socket } from "../../contexts";
import { useQuery } from "@tanstack/react-query";
import studentApi from "../../api/student";
import PropTypes from 'prop-types';
import { Alert, CircularProgress } from "@mui/material";
import StudentItem from "./StudentItem";

const OnlineStudents = ({ setDeleteConfirm, setStudentInfo }) => {

    // states
    const [studentsId, setStudentsId] = useState([]);

    // fetch students by student id
    const { data: students = [], isLoading, } = useQuery({
        queryKey: ['onlineStudents', studentsId],
        queryFn: async () => {
            const ids = studentsId.map(i => i.id);
            const res = await studentApi.getStudentsById({ ids: ids });
            return res.data;
        }
    });


    // get online students
    useEffect(() => {
        socket.on('get-online-students', (onlineStudents) => {
            console.log(onlineStudents);
            setStudentsId(onlineStudents);
        });
    }, []);

    return (
        <>
            <div className="mb-5">
                <p className="text-sm">( {studentsId?.length || 0} Students )</p>
            </div>

            {/* loading animation */}
            {isLoading && <div className="flex justify-center py-5">
                <CircularProgress sx={{ '& circle': { stroke: '#1B3B7D' } }} />
            </div>}

            {!isLoading && (Array.isArray(students) && students?.length > 0 ?
                <div className="grid grid-cols-3 gap-6">
                    {students.map(student => <StudentItem
                        student={student}
                        key={student?.id}
                        setDeleteConfirm={setDeleteConfirm}
                        setStudentInfo={setStudentInfo}
                    />)}
                </div> :
                <Alert icon={false} severity="warning" className="mx-auto w-fit">No Students Found</Alert>
            )}
        </>
    );
}

OnlineStudents.propTypes = {
    setDeleteConfirm: PropTypes.func,
    setStudentInfo: PropTypes.func
};

export default OnlineStudents;
