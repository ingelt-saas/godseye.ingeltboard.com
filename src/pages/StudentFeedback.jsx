import { Add } from "@mui/icons-material";
import { Alert, Button, CircularProgress } from "@mui/material";
import AddFeedback from "../components/StudentFeedback/AddFeedback";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import feedbackApi from "../api/feedback";
import FeedbackItem from "../components/StudentFeedback/FeedbackItem";

const StudentFeedback = () => {

    // states
    const [isOpen, setIsOpen] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });
    const [searchQuery, setSearchQuery] = useState('');

    // fetch feedbacks
    const { data: feedbacks, refetch, isLoading } = useQuery({
        queryKey: ['studentFeedback', searchQuery, pagination],
        queryFn: async () => {
            const res = await feedbackApi.getAll(pagination.page, pagination.limit, searchQuery);
            return res.data;
        }
    });

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium flex justify-between items-center">
                Student Feedback
                <Button className='!text-sm !px-6 !capitalize !py-3 !rounded-md !text-white !bg-[#1B3B7D]' onClick={() => setIsOpen(true)} variant="contained" startIcon={<Add />} >Add Feedback</Button>
            </h1>
            {isLoading && <div className="mt-10 flex justify-center">
                <CircularProgress />
            </div>}

            {!isLoading && <div className="mt-10">
                {feedbacks?.rows?.length <= 0 && <Alert severity="error" icon={false} className="!mx-auto !w-fit">No Feedbacks Found</Alert>}
                {feedbacks?.rows?.length > 0 && <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {feedbacks?.rows?.map((feedback, index) => <FeedbackItem
                        feedback={feedback}
                        key={index}
                    />)}
                </div>}
            </div>}

            {/* add Feedback modal */}
            <AddFeedback open={isOpen} close={() => setIsOpen(false)} refetch={refetch} />
        </div>
    );
}

export default StudentFeedback;
