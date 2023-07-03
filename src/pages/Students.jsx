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

const Students = () => {

    const [filter, setFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 50 });
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data: students = [], isLoading, refetch } = useQuery({
        queryKey: ['students', pagination, searchQuery, filter],
        queryFn: async () => {
            const res = await studentApi.getStudents(
                pagination.page,
                pagination.limit,
                filter,
                searchQuery
            );
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

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">InGelt Students</h1>
            <div className="mt-10">

                {/* loading animation */}
                {isLoading && <div className="flex justify-center py-5">
                    <CircularProgress sx={{ '& circle': { stroke: '#1B3B7D' } }} />
                </div>}

                {!isLoading && (Array.isArray(students?.rows) && students?.rows?.length ?
                    <div>
                        <div className="grid grid-cols-3 gap-6">
                            {students.rows?.map(({ id, name, image, email, gender, dob, organization }) =>
                                <div className='flex flex-col gap-y-4 border cursor-pointer border-[#E1E1E1] py-4 px-4 shadow-md bg-white items-start rounded-lg' key={id}>
                                    <StudentImage student={{ image, name }} />
                                    <div className="w-full flex-1">
                                        <table className="w-full !text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Name<span>:</span></span>
                                                    </td>
                                                    <td>{name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Email<span>:</span></span>
                                                    </td>
                                                    <td>{email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Gender<span>:</span></span>
                                                    </td>
                                                    <td>{gender || 'Not Set'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">DOB<span>:</span></span>
                                                    </td>
                                                    <td>{dob ? moment(dob).format('ll') : 'Not Set'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {organization && <p className="text-sm mt-2">Student of <strong>{organization?.name}</strong></p>}
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
                                            setDeleteConfirm({ name, id });
                                        }}
                                    >Delete</Button>
                                </div>
                            )}
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

                {/* delete confirm modal */}
                <DeleteConfirmModal
                    close={() => setDeleteConfirm(null)}
                    open={Boolean(deleteConfirm)}
                    data={deleteConfirm}
                    name={'student'}
                    confirmHandler={deleteStudent}
                />

            </div>
        </div>
    );
}

export default Students;
