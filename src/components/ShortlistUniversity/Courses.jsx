import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import courseApi from "../../api/course";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import PaginationComponent from "../shared/PaginationComponent";
import AddCourseModal from "./AddCourseModal";

const Courses = () => {

    const [pagination, setPagination] = useState({ page: 1, rows: 30, });
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [search] = useSearchParams();
    const universityId = search.get('universityId');

    const { data, isLoading } = useQuery({
        queryKey: ['courses', pagination, searchQuery, universityId],
        queryFn: async () => {
            const res = await courseApi.getCourses(pagination.page, pagination.rows, universityId);
            return res.data;
        }
    });

    const searchHandler = (e) => {
        e.preventDefault();
        setPagination({ page: 1, limit: 30 });
        setSearchQuery(e.target.search.value);
    }

    return (
        <div className="">
            <div className="pb-2 border-b flex justify-between">
                <h1 className="text-2xl font-medium pl-3">University Courses</h1>
                <Button
                    variant="contained"
                    sx={{
                        color: 'white',
                        backgroundColor: '#001E43',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: '#001E43',
                        }
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    Add Course
                </Button>
                <form className="flex items-center" onSubmit={searchHandler}>
                    <input name="search" className="border-2 rounded-md rounded-r-none border-r-0 py-2 px-4 outline-none w-[300px] text-sm" placeholder="Search by course name or level" />
                    <button className="text-sm px-5 py-2 border border-[#001E43] bg-[#001E43] text-white">Search</button>
                </form>
            </div>

            <div className="mt-10">
                {isLoading && <div className="py-5 flex justify-center">
                    <CircularProgress sx={{ '& circle': { stroke: '#001E43' } }} />
                </div>}

                {!isLoading && (Array.isArray(data?.rows) && data?.rows?.length > 0 ?
                    <>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {data?.rows.map(item =>
                                <div className='border border-[#E1E1E1] py-4 px-4 shadow-md bg-white flex flex-col items-start rounded-lg' key={item.id}>
                                    <div className="w-full mt-2">
                                        <table className="w-full !text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Name<span>:</span></span>
                                                    </td>
                                                    <td>{item?.student?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Email<span>:</span></span>
                                                    </td>
                                                    <td>{item?.student?.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Gender<span>:</span></span>
                                                    </td>
                                                    <td>{item?.student?.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">DOB<span>:</span></span>
                                                    </td>
                                                    <td>{item?.student?.dob && moment(item?.student?.dob).format('ll')}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">University<span>:</span></span>
                                                    </td>
                                                    <td>{item?.university?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold pr-2">
                                                        <span className="flex items-start justify-between w-full">Course<span>:</span></span>
                                                    </td>
                                                    <td>{item?.university?.courseName}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <p className="text-sm mt-2">Applied on <strong>{student?.organization?.name}</strong></p> */}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-10 flex justify-center">
                            <PaginationComponent
                                currentPage={pagination.page}
                                onPageChange={(page) => setPagination({ ...pagination, page: page })}
                                totalPages={Math.ceil(data?.count / pagination.rows)}
                            />
                        </div>
                    </> :
                    <Alert severity="warning" icon={false} className="w-fit mx-auto">No Course Found</Alert>
                )}
            </div>

            {/* add or update modal */}
            <AddCourseModal
                open={isOpen}
                close={() => setIsOpen(false)}
            />

        </div>
    );
}

export default Courses;
