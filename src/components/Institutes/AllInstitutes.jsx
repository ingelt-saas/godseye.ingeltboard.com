import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import instituteApi from "../../api/institute";
import { Alert } from "@mui/material";
import InstituteItem from "./InstituteItem";
import PaginationComponent from "../shared/PaginationComponent";

const AllInstitutes = () => {

    const [pagination, setPagination] = useState({ page: 1, rows: 10 });
    const [searchQuery, setSearchQuery] = useState('');
    // const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data: institutes, isLoading, refetch } = useQuery({
        queryKey: ['institutes', pagination, searchQuery],
        queryFn: async () => {
            const res = await instituteApi.read(pagination.page, pagination.rows, searchQuery);
            return res.data;
        }
    });

    //     < InstituteItem
    // key = { index }
    // applyHandler = { applyHandler }
    // appliedInstitutes = { appliedInstitutes }
    // institute = { institute }
    //     />

    return (
        <div className="">
            {!isLoading && (Array.isArray(institutes?.rows) && institutes?.rows?.length > 0 ?
                <div className="flex flex-col gap-y-5">
                    {institutes?.rows?.map(item =>
                        <InstituteItem
                            key={item.id}
                            institute={item}
                        />
                    )}
                    <div className="flex justify-center">
                        <PaginationComponent
                            currentPage={pagination.page}
                            onPageChange={(page) => setPagination({ ...pagination, page: page })}
                            totalPages={Math.ceil(institutes?.count / pagination.rows)}
                        />
                    </div>
                </div> :
                <Alert icon={false} severity="warning" className="w-fit mx-auto">
                    No Institute Found
                </Alert>
            )}
        </div>
    );
}

export default AllInstitutes;
