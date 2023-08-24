import { useEffect, useState } from "react";
import { ArrowDropDown } from '@mui/icons-material';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import studentActivityApi from "../api/studentActivity";
import moment from 'moment';
import StudentsModal from "../components/StudentActivity/StudentsModal";

export const months = [
    { id: 0, value: 'January' },
    { id: 1, value: 'February' },
    { id: 2, value: 'March' },
    { id: 3, value: 'April' },
    { id: 4, value: 'May' },
    { id: 5, value: 'June' },
    { id: 6, value: 'July' },
    { id: 7, value: 'August' },
    { id: 8, value: 'September' },
    { id: 9, value: 'October' },
    { id: 10, value: 'November' },
    { id: 11, value: 'December' },
];

export const getFutureYears = (numYears = 20) => {

    const currentYear = new Date().getFullYear();
    const minimumYear = 2023; // Starting from 2024 and onwards
    const futureYears = [];

    for (let i = 0; i < numYears; i++) {
        if (minimumYear + i <= currentYear) {
            futureYears.push(minimumYear + i);
        }
    }

    return futureYears;
}

const StudentActivity = () => {

    // states 
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(null);

    const years = getFutureYears(); // get years from 2023
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // set current year in the selected year and set month
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear);
        const currentMonth = new Date().getMonth();
        setSelectedMonth(months.find(i => i.id === currentMonth));

    }, []);

    // set current date
    useEffect(() => {
        if (selectedMonth) {
            const month = selectedMonth?.id;
            setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), month));
        }
    }, [selectedMonth]);

    // fetch data using tanstack query
    const { data = [], isLoading, } = useQuery({
        queryKey: ['studentActivity', selectedYear, selectedMonth],
        queryFn: async () => {
            if (!selectedYear || !selectedMonth) {
                return;
            }
            const res = await studentActivityApi.getActiveStudents(selectedYear, selectedMonth.id + 1);
            return res.data;
        }
    });

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">Student Activity</h1>
            <div className='flex justify-between gap-5 items-center mt-10'>
                <div></div>
                <div className="flex gap-3 flex-wrap">
                    <FormControl size='small' variant="outlined" sx={{ width: '130px', textAlign: 'center', '& fieldset': { borderColor: '#0C3C82 !important' } }}>
                        <Select
                            sx={{ borderRadius: '0.4rem', color: '#0C3C82', }}
                            labelId="select-label"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            IconComponent={ArrowDropDown}
                            MenuProps={{ sx: { maxHeight: '80vh' } }}
                        >
                            {years.map((year, index) => <MenuItem key={index} value={year}>{year}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size='small' variant="outlined" sx={{ width: '130px', textAlign: 'center', '& fieldset': { borderColor: '#0C3C82 !important' } }}>
                        <Select
                            sx={{ borderRadius: '0.4rem', color: '#0C3C82', }}
                            labelId="select-label"
                            value={selectedMonth?.id || new Date().getMonth()}
                            onChange={(e) => setSelectedMonth(months.find(i => i.id === e.target.value))}
                            IconComponent={ArrowDropDown}
                            MenuProps={{ sx: { maxHeight: '80vh' } }}
                        >
                            {months.map(({ id, value }) => <MenuItem key={id} value={id}>{value}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="mt-5">
                <div className="grid grid-cols-7 bg-white shadow-lg rounded-2xl overflow-hidden table-collapse border">

                    {weekdays.map((day) => (
                        <div key={day} className="text-center font-medium text-sm px-2 py-3 border">
                            {day}
                        </div>
                    ))}

                    {[...Array(firstDayOfMonth)].map((_, index) => (
                        <div className='px-2 py-3 border' key={`empty-${index}`} />
                    ))}

                    {[...Array(daysInMonth)].map((_, index) => {
                        const day = index + 1;
                        const date = `${currentDate.getMonth() + 1}-${day}-${currentDate.getFullYear()}`;
                        const isDateMatch = data.find(i => moment(i.date).format('DD-MM-YYYY') === moment(new Date(date)).format('DD-MM-YYYY'));
                        return (
                            <div
                                key={`day-${day}`}
                                className="text-center px-2 py-3 cursor-pointer border font-medium hover:bg-[#0C3C82] hover:bg-opacity-30 duration-200 grid place-items-center relative"
                                onClick={() => isDateMatch && setIsOpen(date)}
                            >
                                {isDateMatch?.studentCount || 0}
                                <span className="absolute text-xs top-1 right-2">{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* student spend hour modal */}
            <StudentsModal
                open={Boolean(isOpen)}
                close={() => setIsOpen(null)}
                date={isOpen}
            />
        </div>
    );
}

export default StudentActivity;
