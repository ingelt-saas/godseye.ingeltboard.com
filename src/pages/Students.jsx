import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import studentApi from "../api/student";
import { Alert, Button, CircularProgress } from "@mui/material";
import PaginationComponent from "../components/shared/PaginationComponent";
import moment from "moment";
import { StudentImage } from "../components/Institutes/AppliedStudents";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../components/shared/DeleteConfirmModal";
import StudentInfoModal from "../components/Student/StudentInfoModal";
import { useSearchParams } from 'react-router-dom';
import StudentItem from "../components/Student/StudentItem";
import OnlineStudents from "../components/Student/OnlineStudents";

const Students = () => {

    const [filter, setFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 50 });
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [search, setSearch] = useSearchParams();
    const page = search.get('page');

    const { data: students = {}, isLoading, refetch } = useQuery({
        queryKey: ['students', pagination, searchQuery, filter],
        queryFn: async () => {
            const res = await studentApi.getStudents(pagination.page, pagination.limit, filter, searchQuery);
            return res.data;
        }
    });

    // student delete handler 
    const deleteStudent = async (e) => {
        if (!deleteConfirm) {
            return;
        }

        e.target.disabled = true;
        try {
            await studentApi.delete(deleteConfirm.id);
            toast.success(`${deleteConfirm.name} deleted`);
            refetch();
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
        } finally {
            e.target.disabled = false;
        }
    }

    // search handler
    const searchHandler = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
        setPagination({ page: 1, limit: 50 });
    }

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">InGelt Students</h1>
            <div className="mt-10">

                <div className="flex mb-5 justify-between">
                    <div className="">
                        <button onClick={() => setSearch({})} className={`!text-sm !font-medium text-[#001E43] bg-[#001E43] bg-opacity-10 duration-300 !capitalize w-24 rounded py-2 ${!page && 'bg-[#001E43] bg-opacity-100 text-white'}`} >All</button>
                        <button onClick={() => setSearch({ page: 'online' })} className={`!text-sm !font-medium text-[#001E43] bg-[#001E43] bg-opacity-10 duration-300 !capitalize w-24 rounded py-2 ${page === 'online' && 'bg-[#001E43] bg-opacity-100 text-white'}`} >Online</button>
                        {/* <button onClick={() => setSearch({ page: 'offline' })} className={`!text-sm !font-medium text-[#001E43] bg-[#001E43] bg-opacity-10 duration-300 !capitalize w-24 rounded py-2 ${page === 'offline' && 'bg-[#001E43] bg-opacity-100 text-white'}`} >Offline</button> */}
                    </div>
                    <form className="flex items-center" onSubmit={searchHandler}>
                        <input name="search" className="border-2 rounded-md rounded-r-none border-r-0 py-2 px-4 outline-none w-[300px] text-sm" placeholder="Search by student or institute" />
                        <button className="text-sm px-5 py-2 border border-[#001E43] bg-[#001E43] text-white">Search</button>
                    </form>
                </div>

                {page !== 'online' && <>

                    <div className="mb-5">
                        <p className="text-sm">( {students?.count || 0} Students )</p>
                    </div>

                    {/* loading animation */}
                    {isLoading && <div className="flex justify-center py-5">
                        <CircularProgress sx={{ '& circle': { stroke: '#1B3B7D' } }} />
                    </div>}

                    {!isLoading && (Array.isArray(students?.rows) && students?.rows?.length ?
                        <div>
                            <div className="grid grid-cols-3 gap-6">
                                {students.rows?.map(student => <StudentItem
                                    student={student}
                                    key={student?.id}
                                    setDeleteConfirm={setDeleteConfirm}
                                    setStudentInfo={setStudentInfo}
                                />)}
                            </div>
                            <div className="mt-10 mx-auto flex justify-center">
                                <PaginationComponent
                                    currentPage={pagination.page}
                                    onPageChange={(page) => setPagination({ ...pagination, page: page })}
                                    totalPages={Math.ceil(students?.count / pagination.limit)}
                                />
                            </div>
                        </div> :
                        <Alert icon={false} severity="warning" className="mx-auto w-fit">No Students Found</Alert>
                    )}

                </>}

                {/* online students */}
                {page === 'online' && <OnlineStudents setDeleteConfirm={setDeleteConfirm} setStudentInfo={setStudentInfo} />}

                {/* delete confirm modal */}
                <DeleteConfirmModal
                    close={() => setDeleteConfirm(null)}
                    open={Boolean(deleteConfirm)}
                    data={deleteConfirm}
                    name={'student'}
                    confirmHandler={deleteStudent}
                />

                {/* student info modal */}
                {studentInfo && <StudentInfoModal
                    open={Boolean(studentInfo)}
                    close={() => setStudentInfo(null)}
                    data={studentInfo}
                />}

            </div>
        </div >
    );
}

export default Students;
