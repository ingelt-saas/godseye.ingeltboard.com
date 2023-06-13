import { Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AddInstitute from "../components/Institutes/AddInstitute";
import AllInstitutes from "../components/Institutes/AllInstitutes";

const Institute = () => {

    const [search, setSearch] = useSearchParams();
    const page = search.get('page');

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Institutes</h1>
            <div className="flex items-center gap-x-2 border-b-4 border-[#DCDEE1] mt-10">
                <Button
                    onClick={() => setSearch({ page: 'all' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'all' || !page ? 'black' : '#00000099',
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
                            backgroundColor: page === 'all' || !page ? 'black' : 'transparent',
                        }
                    }}
                >
                    All Institutes
                </Button>
                <Button
                    onClick={() => setSearch({ page: 'applied' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'applied' ? 'black' : '#00000099',
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
                            backgroundColor: page === 'applied' ? 'black' : 'transparent',
                        }
                    }}
                >
                    Applied Institutes
                </Button>
                <Button
                    onClick={() => setSearch({ page: 'add-institute' }, { replace: true })}
                    sx={{
                        bgColor: 'transparent',
                        color: page === 'add-institute' ? 'black' : '#00000099',
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
                            backgroundColor: page === 'add-institute' ? 'black' : 'transparent',
                        }
                    }}
                >
                    Add Institute
                </Button>
            </div>
            <div className="mt-5">
                {page === 'add-institute' && <AddInstitute />}
                {page === 'all' && <AllInstitutes />}
            </div>
        </div>
    );
}

export default Institute;
