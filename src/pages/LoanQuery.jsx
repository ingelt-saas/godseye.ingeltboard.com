import { useQuery } from '@tanstack/react-query';
import loanQueryApi from '../api/loanQuery';
import { useState } from 'react';
import { CircularProgress, Alert, Button } from '@mui/material';
import PaginationComponent from '../components/shared/PaginationComponent';
import { StudentImage } from '../components/Institutes/AppliedStudents';
import { Delete } from '@mui/icons-material';
import moment from 'moment';
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';

const LoanQueryItem = ({ data, setDeleteConfirm }) => {

    const { student, annualIncome, preferredIntake, createdAt } = data;

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
                            <span className="flex items-start justify-between w-full">Gender<span>:</span></span>
                        </td>
                        <td>{student?.gender || 'Not Set'}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Annual Income<span>:</span></span>
                        </td>
                        <td>{annualIncome || 'Not Set'}</td>
                    </tr>
                    <tr>
                        <td className="font-semibold pr-2">
                            <span className="flex items-start justify-between w-full">Preferred Intake<span>:</span></span>
                        </td>
                        <td>{preferredIntake || 'Not Set'}</td>
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
                setDeleteConfirm(student);
            }}
        >Delete</Button>
    </div>
    );
}


const LoanQuery = () => {

    const [pagination, setPagination] = useState({ page: 1, limit: 50 });
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);


    const { data: loanQueries, isLoading, refetch } = useQuery({
        queryKey: ['loanQueries', searchQuery, pagination],
        queryFn: async () => {
            const res = await loanQueryApi.getAll(pagination.page, pagination.limit, searchQuery);
            return res.data;
        }
    });

    // search handler
    const searchHandler = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
        setPagination({ page: 1, limit: 50 });
    }

    // 
    const deleteQuery = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await loanQueryApi.delete(deleteConfirm.id);
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
                <h1 className=" text-3xl font-medium">Loan Queries</h1>
                <form className="flex items-center" onSubmit={searchHandler}>
                    <input name="search" className="border-2 rounded-md rounded-r-none border-r-0 py-2 px-4 outline-none w-[300px] text-sm" placeholder="Search by student or institute" />
                    <button className="text-sm px-5 py-2 border border-[#001E43] bg-[#001E43] text-white">Search</button>
                </form>
            </div>
            <div className='mt-10'>
                {isLoading && <div className="flex py-10 justify-center">
                    <CircularProgress />
                </div>}
                {!isLoading && (Array.isArray(loanQueries?.rows) && loanQueries?.rows?.length > 0 ?
                    <div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {loanQueries?.rows.map(item => <LoanQueryItem key={item.id} data={item} setDeleteConfirm={setDeleteConfirm} />)}
                        </div>
                        <div className="mt-10 mx-auto flex justify-center">
                            <PaginationComponent
                                currentPage={pagination.page}
                                onPageChange={(page) => setPagination({ ...pagination, page: page })}
                                totalPages={Math.ceil(loanQueries?.count / pagination.limit)}
                            />
                        </div>
                    </div>
                    : <Alert icon={false} severity="warning" className="mx-auto w-fit" >No University Found</Alert>
                )}
            </div>
            {/* delete confirm modal  */}
            <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                open={Boolean(deleteConfirm)}
                data={deleteConfirm}
                name={'loan query'}
                confirmHandler={deleteQuery}

            />
        </div>
    );
}

export default LoanQuery;
