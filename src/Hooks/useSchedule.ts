import React from "react";
import toast from "react-hot-toast";
import { addFirebaseData, getFirebaseData } from "../utils/firebase";
import {
    format,
    parse,
    startOfWeek,
    getDay,
    startOfMonth,
    endOfMonth,
    startOfDay,
    endOfDay,
    startOfWeek as dfStartOfWeek,
    endOfWeek as dfEndOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { getDateTimeRange } from "../utils";
import { Timestamp } from "firebase/firestore";
import transformToCalendarEvents from "../utils/transformToCalenderEvents";

const useSchedule = () => {
    const [ isLoading, setLoading ] = React.useState(true);
    const [ isLoadingToday, setLoadingToday ] = React.useState(true);
    const [ isSaving, setSaving ] = React.useState(false);
    const [ schedules, setSchedules ] = React.useState([]);
    const [ todaySchedules, setTodaySchedules ] = React.useState([]);
    const [ inputs, setInputs ] = React.useState({
        title: "",
        subject: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        location: "",
        isOnline: false,
        hasReminder: false,
        reminder: "",
    });
    const [ isModalOpen, setIsModalOpen ] = React.useState(false);


    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    const toggleModal = () => setIsModalOpen(prev => !prev);

    const [view, setView] = React.useState("month");
        const [range, setRange] = React.useState(() => computeRange(new Date(), "month"));
    
        // computeRange: given a date + view, returns the start/end
        function computeRange(date, view) {
            switch (view) {
                case "day":
                    return { dateFrom: startOfDay(date), dateTo: endOfDay(date) };
                case "week":
                    // react-big-calendar’s week starts on your localizer’s startOfWeek
                    const weekStart = dfStartOfWeek(date, { locale: enUS });
                    return {
                        dateFrom: startOfDay(weekStart),
                        dateTo: endOfDay(dfEndOfWeek(date, { locale: enUS })),
                    };
                case "month":
                default:
                    return {
                        dateFrom: startOfMonth(date),
                        dateTo: endOfMonth(date),
                    };
            }
        }
    
        // whenever view or date changes, recompute range and fetch
        const onNavigate = (date, action) => {
            const newRange = computeRange(date, view);
            setRange(newRange);
        };
    
        const onViewChange = (newView) => {
            setView(newView);
            // recalc using today's date (or you could track the current date of the calendar)
            setRange(computeRange(new Date(), newView));
        };        
    

    const getSchedules = async ({ dateFrom, dateTo, callback } = {} as any) => {
        let errorMessage = "Something went wrong getting schedules";
        try {
            if(!user) throw new Error("User is not logged in");

            if(!callback) setLoading(true);

            const { status, data } = await getFirebaseData({
                collection: "Schedules",
                refFields: ['staticSubjectRef'],
                query: [
                    ['teacher_id', '==', user.teacher_id],
                    ["start", ">=", dateFrom ?? range.dateFrom, "timestamp"],
                    ["end", "<=", dateTo ?? range.dateTo, "timestamp"],
                ],
                orderBy: ['start', 'asc']
            })

            if(status === "error") throw new Error(errorMessage);

            const schedules = data.Schedules;

            if(callback){
                return callback(schedules);
            }

            const events = transformToCalendarEvents(schedules);
            setSchedules(events as any);

        } catch(error){
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const validateInput = () => {
        const { 
            title, 
            subject,
            date, 
            timeFrom,
            timeTo,
            location, 
            isOnline,
            hasReminder, 
            reminder,  
        } = inputs;

        if(!title) throw new Error("Enter title");
        if(!subject) throw new Error("Enter subject");
        if(!date) throw new Error("Enter date");
        if(!timeFrom) throw new Error("Enter time from");
        if(!timeTo) throw new Error("Enter time to");
        if(!location && !isOnline) throw new Error("Enter location");
        if(!reminder && hasReminder) throw new Error("Enter reminder");

        let reminderDate: null | Date = null;

        const { startDate, endDate } = getDateTimeRange(date, timeFrom, timeTo);
        if(reminder){
            const { startDate } = getDateTimeRange(date, reminder);
            reminderDate = startDate;
        }

        return {
            title,
            location: isOnline ? null : location,
            isOnline,
            reminder: reminderDate ? Timestamp.fromDate(new Date(reminderDate)) : null,
            staticSubjectRef: {
                isRef: true,
                collection: "StaticSubjects",
                id: subject,
            },
            start: startDate,
            end: endDate,
            teacher_id: user.teacher_id,
        }

    }

    const handleAddSchedule = async () => {
        try {
            setSaving(true);
            if(!user) throw new Error("User is not logged in");
            const validatedInput = validateInput();

            const { status, data: newSchedule } = await addFirebaseData({
                collection: "Schedules",
                data: validatedInput,
                successMessage: ""
            })

            if(status === "error") throw new Error("Failed to add schedule");

            const data = {
                ...newSchedule,
                subjectRef: null
            }

            const newEvent = transformToCalendarEvents([data] as any);

            setSchedules(prev => [...prev, ...newEvent] as any);

            toast.success("Schedule has been added");
            toggleModal();

        } catch(error) {
            toast.error(error.message)
        } finally {
            setSaving(false);
        }
    }

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const getTodaySchedules = async () => {
        const today = new Date();
        const dateFrom = startOfDay(today);
        const dateTo = endOfDay(today);

        const callback = (schedules) => {
            setTodaySchedules(schedules)
        }

        setLoadingToday(true);
        await getSchedules({ dateFrom, dateTo, callback });
        setLoadingToday(false);
    } 

    React.useEffect(() => {
        getSchedules();
    }, [range]);

    React.useEffect(() => {
        getTodaySchedules()
    }, [])

    return {
        isSaving,
        isLoading,
        isLoadingToday,
        view,
        inputs,
        schedules,
        isModalOpen,
        todaySchedules,
        toggleModal,
        onNavigate,
        onViewChange,
        handleAddSchedule,
        handleInput,
    }
}

export default useSchedule;