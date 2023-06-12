import { Alert, Button, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AddUniversity from "../components/ShortlistUniversity/AddUniversity";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import universityApi from "../api/university";
import UniversityItem from "../components/ShortlistUniversity/UniversityItem";
import DeleteConfirmModal from "../components/shared/DeleteConfirmModal";
import { toast } from "react-toastify";
import PaginationComponent from "../components/shared/PaginationComponent";

const ShortlistUniversity = () => {

    const [search, setSearch] = useSearchParams();
    const page = search.get('page');
    const [pagination, setPagination] = useState({ page: 1, rows: 10 });
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data: universities, isLoading, refetch } = useQuery({
        queryKey: ['universities', pagination, searchQuery],
        queryFn: async () => {
            const res = await universityApi.read(pagination.page, pagination.rows, searchQuery);
            return res.data;
        }
    });

    const deleteUniversity = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await universityApi.delete(deleteConfirm.id);
            refetch();
            setDeleteConfirm(null);
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            e.target.disabled = false;
        }
    }

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Shortlist Universities</h1>
            <div className="flex items-center gap-x-2 border-b-4 border-[#DCDEE1] mt-10">
                <Button
                    onClick={() => setSearch({ page: 'all-university' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'all-university' || !page ? 'black' : '#00000099',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        padding: '0.8rem 1.5rem',
                        fontSize: '0.8rem',
                        '&:hover': {
                            bgColor: 'transparent !important',
                        },
                        '&:after': {
                            content: '""',
                            height: '4px',
                            width: '100%',
                            position: 'absolute',
                            bottom: '-4px',
                            left: '0',
                            backgroundColor: page === 'all-university' || !page ? 'black' : 'transparent',
                        }
                    }}
                >
                    All University
                </Button>
                <Button
                    onClick={() => setSearch({ page: 'add-university' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'add-university' ? 'black' : '#00000099',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        padding: '0.8rem 1.5rem',
                        fontSize: '0.8rem',
                        position: 'relative',
                        '&:hover': {
                            bgColor: 'transparent !important',
                        },
                        '&:after': {
                            content: '""',
                            height: '4px',
                            width: '100%',
                            position: 'absolute',
                            bottom: '-4px',
                            left: '0',
                            backgroundColor: page === 'add-university' ? 'black' : 'transparent',
                        }
                    }}
                >
                    Add University
                </Button>
            </div>
            <div className="mt-10">
                {page === 'add-university' && <AddUniversity />}
                {page === 'all-university' && <div className="px-3">
                    {isLoading && <div className="flex py-10 justify-center">
                        <CircularProgress />
                    </div>}
                    {!isLoading && (Array.isArray(universities?.rows) && universities?.rows?.length > 0 ?
                        <div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {universities?.rows.map(item =>
                                    <UniversityItem
                                        university={item}
                                        key={item.id}
                                        deleteConfirm={setDeleteConfirm}
                                    />
                                )}
                            </div>
                            <div className="mt-10 mx-auto flex justify-center">
                                <PaginationComponent
                                    currentPage={pagination.page}
                                    onPageChange={(page) => setPagination({ ...pagination, page: page })}
                                    totalPages={Math.ceil(universities?.count / pagination.rows)}
                                />
                            </div>
                        </div>
                        : <Alert icon={false} severity="warning" className="mx-auto w-fit" >No University Found</Alert>
                    )}
                </div>}
            </div>

            <DeleteConfirmModal
                open={Boolean(deleteConfirm)}
                close={() => setDeleteConfirm(null)}
                data={deleteConfirm}
                confirmHandler={deleteUniversity}
                name={'university'}
            />
        </div>
    );
}

export default ShortlistUniversity;
