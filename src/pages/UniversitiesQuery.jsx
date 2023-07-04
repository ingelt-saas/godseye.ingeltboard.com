import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const UniversitiesQuery = () => {

    const [pagination, setPagination] = useState({ page: 1, limit: 50 });
    const [searchQuery, setSearchQuery] = useState('');
    // const []

    const { data: universitiesQueries = [], isLoading, refetch } = useQuery({
        queryKey: ['universitiesQueries', pagination, searchQuery],
        queryFn: async () => {

        }
    });


    // search handler
    const searchHandler = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
        setPagination({ page: 1, limit: 50 });
    }

    return (
        <div className='px-5'>
            <div className='flex justify-between items-center pb-2 border-b'>
                <h1 className=" text-3xl font-medium">Universities Queries</h1>
                <form className="flex items-center" onSubmit={searchHandler}>
                    <input name="search" className="border-2 rounded-md rounded-r-none border-r-0 py-2 px-4 outline-none w-[300px] text-sm" placeholder="Search by student or institute" />
                    <button className="text-sm px-5 py-2 border border-[#001E43] bg-[#001E43] text-white">Search</button>
                </form>
            </div>
            <div className='mt-10'>
                {isLoading && <div className="flex py-10 justify-center">
                    <CircularProgress />
                </div>}
                {/* {!isLoading && (Array.isArray(loanQueries?.rows) && loanQueries?.rows?.length > 0 ?
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
                )} */}
            </div>
            {/* delete confirm modal  */}
            {/* <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                open={Boolean(deleteConfirm)}
                data={deleteConfirm}
                name={'loan query'}
                confirmHandler={deleteQuery}

            /> */}
        </div>
    );
}

export default UniversitiesQuery;
