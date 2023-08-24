import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import studentActivityApi from '../api/studentActivity';
import { CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { getFutureYears, months } from './StudentActivity';
import { ArrowDropDown } from '@mui/icons-material';
import moment from 'moment';

const StudentActivityDetails = () => {

    // states
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [activities, setActivities] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [currentDate, setCurrentDate] = useState(new Date());
    const { studentId } = useParams();

    const years = getFutureYears(); // get years from 2023
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const secondsToHMS = (seconds) => {
        const hours = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60); // 1 minute = 60 seconds
        const remainingSeconds = seconds % 60;

        let output = '';

        if (hours) {
            output += `${hours}H, `;
        }
        if (minutes) {
            output += `${minutes}M, `;
        }
        if (remainingSeconds) {
            output += `${remainingSeconds}S, `;
        }

        return output;

    }

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


    useEffect(() => {
        if (studentId && selectedYear && selectedMonth?.id) {
            (async () => {
                try {
                    const res = await studentActivityApi.getActivitiesByStudentId(studentId, selectedYear, selectedMonth?.id + 1);
                    if (res.data) {
                        setStudent(res.data.student);
                        setActivities(res.data.activities);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [studentId, selectedMonth, selectedYear]);

    if (loading) {
        return <div className='flex justify-center py-5'>
            <CircularProgress color='inherit' />
        </div>
    }

    return (
        <div className="px-5">
            <h1 className="pb-2 border-b text-3xl font-medium">{student?.name} Activity</h1>
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
                        const isDateMatch = activities.find(i => moment(i.date).format('DD-MM-YYYY') === moment(new Date(date)).format('DD-MM-YYYY'));

                        return (
                            <div
                                key={`day-${day}`}
                                className="text-center px-2 py-3 cursor-pointer border font-medium hover:bg-[#0C3C82] hover:bg-opacity-30 duration-200 grid place-items-center text-xs relative"
                            >
                                {isDateMatch ? secondsToHMS(isDateMatch.totalSeconds) : <span className='text-xs'>No active</span>}
                                <span className="absolute text-xs top-1 right-2">{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default StudentActivityDetails;
