import { Add, Delete, Done, Edit } from "@mui/icons-material";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import categoryApi from "../../api/category";
import { useQuery } from "@tanstack/react-query";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";

const CategoryItem = ({ category, categories, refetch, deleteConfirm }) => {

    const [editable, setEditable] = useState(false);
    const [error, setError] = useState(false);
    const [name, setName] = useState(category.name);

    const handleUpdate = async (e) => {
        if (error || !name) {
            return;
        }

        e.target.disabled = true;
        try {
            await categoryApi.update(category.id, { name });
            setEditable(false);
            refetch();
        } catch (err) {
            console.error(err)
        } finally {
            e.target.disabled = false;
        }
    }

    return <div>
        <div className={`flex justify-between border-2 rounded-lg overflow-hidden ${editable ? 'border-[#001E43]' : 'border-[#f2f2f2]'}`}>
            <input
                disabled={!editable}
                value={name}
                className="text-sm py-3 px-2 flex-1 !outline-none !border-none"
                onChange={(e) => {
                    setName(e.target.value);
                    const findCategory = categories.filter(i => i.id !== category.id)
                        .find(i => i.name == e.target.value.replace(/\b\w/g, match => match.toUpperCase()));
                    if (e.target.value) {
                        setError(Boolean(findCategory));
                    }
                }}
            />
            <button
                onClick={(e) => editable ? handleUpdate(e) : setEditable(true)}
                className="!border-none !outline-none  border-r-2 bg-[#f2f2f2] px-2 flex items-center">
                {editable ? <Done fontSize="small" /> : <Edit fontSize="small" />}
            </button>
            <button
                onClick={() => deleteConfirm({ name: name, id: category.id })}
                className="!border-none !outline-none rounded-r-md bg-[#f2f2f2] px-2 flex items-center"
            >
                <Delete fontSize="small" />
            </button>
        </div>

        {error && <p className="text-xs mt-1 text-center text-red-500 font-medium">Already exists category</p>}
    </div>
}

const Categories = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const { data: categories = [], isLoading, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await categoryApi.read();
            return res.data;
        }
    });

    // category add handler
    const addCategory = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await categoryApi.create({ name: category });
            setCategory('');
            refetch();
        } catch (err) {
            if (err.response.status === 403) {
                setError(err.response?.data?.message);
            } else {
                setError('Sorry! Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    }

    //delete handler 
    const deleteHandler = async (e) => {
        if (!deleteConfirm) {
            return;
        }
        e.target.disabled = true;
        try {
            await categoryApi.delete(deleteConfirm.id);
            setDeleteConfirm(null);
            refetch();
        } catch (err) {
            console.error(err);
        } finally {
            e.target.disabled = true;
        }
    }

    const findCategory = category ? categories.find(i => i.name == category.replace(/\b\w/g, match => match.toUpperCase())) : null;

    return (
        <>
            <div className="lg:w-11/12 mx-auto bg-white shadow-lg rounded-xl px-5 py-10">
                <div className="flex max-md:flex-col-reverse max-md:gap-y-5 justify-between gap-x-7">
                    <div className="md:w-1/2">
                        <h2 className="text-xl font-medium pb-2 border-b-2 w-full">Categories</h2>
                        <div className="mt-4 flex flex-col gap-y-3">
                            {isLoading && <div className="w-full py-5 flex justify-center">
                                <CircularProgress />
                            </div>}
                            {!isLoading && categories.map(i =>
                                <CategoryItem
                                    category={i}
                                    categories={categories}
                                    key={i.id}
                                    refetch={refetch}
                                    deleteConfirm={setDeleteConfirm}
                                />
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-xl font-medium pb-2 border-b-2 w-full text-center">Add Category</h2>
                        <form className="mt-4 px-4 shadow-lg py-8 rounded-md" onSubmit={addCategory}>
                            <div className="flex flex-col gap-y-6">
                                <TextField
                                    fullWidth
                                    id="standard-basic"
                                    type='text'
                                    label='Category Name'
                                    variant="standard"
                                    name="name"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    InputLabelProps={{ className: '!text-base !pl-3' }}
                                    sx={{
                                        '& .MuiInput-underline:after': {
                                            borderColor: '#001E43 !important',
                                        },
                                        '& label.Mui-focused': {
                                            color: '#001E43 !important',
                                        }
                                    }}
                                />
                                {error && <p className="text-sm text-center text-red-500 font-medium">{error}</p>}
                                {findCategory && <p className="text-sm text-center text-red-500 font-medium">Already exists category</p>}
                                <Button
                                    disabled={loading || Boolean(findCategory)}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#001E43',
                                        textTransform: 'capitalize',
                                        color: 'white',
                                        width: '100%',
                                        padding: '0.6rem 2rem',
                                        borderRadius: '0.5rem',
                                        '&:hover': {
                                            backgroundColor: '#001E43'
                                        }
                                    }}
                                    type="submit"
                                    startIcon={<Add />}
                                >
                                    Add
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* delete confirm modal */}

            <DeleteConfirmModal
                name='category'
                open={Boolean(deleteConfirm)}
                close={() => setDeleteConfirm(null)}
                data={deleteConfirm}
                confirmHandler={deleteHandler}
            />
        </>
    );
}

export default Categories;
