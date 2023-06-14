import { Alert, Button, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AddBlog from "../components/Blogs/AddBlog";
import { useQuery } from '@tanstack/react-query';
import blogsApi from "../api/blogs";
import { useState } from "react";
import PaginationComponent from "../components/shared/PaginationComponent";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../components/shared/DeleteConfirmModal";
import { ArrowRightAlt, Delete } from "@mui/icons-material";
import Image from "../components/shared/Image";

const BlogCard = ({ data, deleteConfirm }) => {

    const { picture, title, text, category } = data;

    return (<div className='rounded-lg shadow-md border border-[#78787840]'>
        <div className='rounded-lg overflow-hidden md:h-36 xl:h-48'>
            <Image src={picture} alt={title} className='w-full h-full object-cover' />
        </div>
        <div className='px-3 py-4 flex flex-col gap-y-3'>
            <span className="bg-[#0C3C82] text-white text-xs rounded-full px-3 py-1 w-fit">{category}</span>
            <h1 className='text-xl text-[#0C3C82] font-medium leading-none'>{title}</h1>
            <p className='text-sm text-[#0C3C82] font-medium'>{text.length > 100 ? text.split('').slice(0, 100).join('') : text}</p>
            <div className="flex justify-between">
                <button className='text-sm font-medium inline-flex items-center gap-1 w-fit'>
                    Read Post
                    <ArrowRightAlt fontSize='small' />
                </button>
            </div>
            <div>
                <Button
                    variant="contained"
                    sx={{
                        color: 'white',
                        borderRadius: '0.5rem',
                        border: '2px solid #1B3B7D',
                        backgroundColor: '#1B3B7D',
                        textTransform: 'capitalize',
                        width: '100%',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            border: '2px solid #1B3B7D',
                            color: '#1B3B7D',
                        }
                    }}
                    endIcon={<Delete />}
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteConfirm({ ...data, name: data.title });
                    }}
                >Delete</Button>
            </div>
        </div>
    </div>);
}


const Blogs = () => {

    const [search, setSearch] = useSearchParams();
    const page = search.get('page');
    const [pagination, setPagination] = useState({ page: 1, rows: 20 });
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['blogs', pagination],
        queryFn: async () => {
            const res = await blogsApi.readAll(pagination.page, pagination.rows, searchQuery);
            return res.data;
        }
    });


    // delete blog handler
    const deleteBlog = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await blogsApi.delete(deleteConfirm.id);
            setDeleteConfirm(null);
            refetch();
        } catch (err) {
            toast.error('Sorry! Something went wrong');
        } finally {
            e.target.disabled = false;
        }
    }

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Blogs</h1>
            <div className="flex items-center gap-x-2 border-b-4 border-[#DCDEE1] mt-10">
                <Button
                    onClick={() => setSearch({ page: 'all' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'all' || !page ? 'black' : '#00000099',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        padding: '0.8rem 1.5rem',
                        fontSize: '0.9rem',
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
                            backgroundColor: page === 'all' || !page ? 'black' : 'transparent',
                        }
                    }}
                >
                    Blogs
                </Button>
                <Button
                    onClick={() => setSearch({ page: 'add-blog' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'add-blog' ? 'black' : '#00000099',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        padding: '0.8rem 1.5rem',
                        fontSize: '0.9rem',
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
                            backgroundColor: page === 'add-blog' ? 'black' : 'transparent',
                        }
                    }}
                >
                    Add Blog
                </Button>
            </div>
            <div className="mt-10">
                {page === 'add-blog' && <AddBlog refetch={refetch} />}
                {page !== 'add-blog' && <div className="md:px-5">
                    {isLoading && <div className="flex justify-center py-5">
                        <CircularProgress />
                    </div>}
                    {!isLoading && (Array.isArray(data?.rows) && data?.rows?.length > 0 ?
                        <div>
                            <div className="grid grid-cols-3 gap-5">
                                {data?.rows?.map(item =>
                                    <BlogCard
                                        data={item}
                                        key={item.id}
                                        deleteConfirm={setDeleteConfirm}
                                    />
                                )}
                            </div>
                            <div className="flex justify-center py-10">
                                <PaginationComponent
                                    currentPage={pagination.page}
                                    onPageChange={(page) => setPagination({ ...pagination, page: page })}
                                    totalPages={Math.ceil(data?.count / pagination.rows)}
                                />
                            </div>
                        </div>
                        :
                        <Alert icon={false} severity="warning" className="mx-auto w-fit">No Blog Found</Alert>
                    )}
                </div>}
            </div>
            <DeleteConfirmModal
                close={() => setDeleteConfirm(null)}
                open={Boolean(deleteConfirm)}
                name={'blog'}
                data={deleteConfirm}
                confirmHandler={deleteBlog}
            />
        </div>
    );
}

export default Blogs;
