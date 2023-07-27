import { Alert, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import visaQueryApi from "../api/visaQuery";
import PaginationComponent from "../components/shared/PaginationComponent";
import DeleteConfirmModal from "../components/shared/DeleteConfirmModal";
import moment from "moment";
import { StudentImage } from "../components/Institutes/AppliedStudents";
import { Delete } from "@mui/icons-material";

const VisaQueryItem = ({ data, setDeleteConfirm }) => {

    const { student, previousRefusal, visaType, interestedCountry, createdAt } = data;

    return (<div className='flex flex-col gap-y-4 border cursor-pointer border-[#E1E1E1] py-4 px-4 shadow-md bg-white items-start rounded-lg'>
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
                        <td>{student?.phoneNo || 'Not Set'}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Interested Country<span>:</span></span>
                        </td>
                        <td>{interestedCountry || 'Not Set'}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Visa Type<span>:</span></span>
                        </td>
                        <td>{visaType || 'Not Set'}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Previous Refusal<span>:</span></span>
                        </td>
                        <td>{previousRefusal || 'Not Set'}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Applied<span>:</span></span>
                        </td>
                        <td>{moment(createdAt).format('ll') || 'Not Set'}</td>
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
                setDeleteConfirm({ ...student, id: data?.id });
            }}
        >Delete</Button>
    </div>
    );
}


const VisaQuery = () => {

    const [pagination, setPagination] = useState({ page: 1, limit: 50 });
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data: visaQueries = [], isLoading, refetch } = useQuery({
        queryKey: ['visaQueries', pagination, searchQuery],
        queryFn: async () => {
            const res = await visaQueryApi.getAll(pagination.page, pagination.limit, searchQuery);
            return res.data;
        }
    });


    // search handler
    const searchHandler = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
        setPagination({ page: 1, limit: 50 });
    }

    const deleteQuery = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await visaQueryApi.delete(deleteConfirm.id);
            refetch();
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
        } finally {
            e.target.disabled = false;
        }
    }

    return (
        <div className='px-5'>
            <div className='flex justify-between items-center pb-2 border-b'>
                <h1 className=" text-3xl font-medium">Visa Queries</h1>
                <form className="flex items-center" onSubmit={searchHandler}>
                    <input name="search" className="border-2 rounded-md rounded-r-none border-r-0 py-2 px-4 outline-none w-[300px] text-sm" placeholder="Search by student" />
                    <button className="text-sm px-5 py-2 border border-[#001E43] bg-[#001E43] text-white">Search</button>
                </form>
            </div>
            <div className='mt-10'>
                {isLoading && <div className="flex py-10 justify-center">
                    <CircularProgress />
                </div>}

                {!isLoading && (Array.isArray(visaQueries?.rows) && visaQueries?.rows?.length > 0 ?
                    <div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {visaQueries?.rows.map(item => <VisaQueryItem key={item.id} data={item} setDeleteConfirm={setDeleteConfirm} />)}
                        </div>
                        <div className="mt-10 mx-auto flex justify-center">
                            <PaginationComponent
                                currentPage={pagination.page}
                                onPageChange={(page) => setPagination({ ...pagination, page: page })}
                                totalPages={Math.ceil(visaQueries?.count / pagination.limit)}
                            />
                        </div>
                    </div>
                    : <Alert icon={false} severity="warning" className="mx-auto w-fit" >No Query Found</Alert>
                )}
            </div>
            {/* delete confirm modal  */}
            <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                open={Boolean(deleteConfirm)}
                data={deleteConfirm}
                name={'visa query'}
                confirmHandler={deleteQuery}

            />
        </div>
    );
}

export default VisaQuery;
