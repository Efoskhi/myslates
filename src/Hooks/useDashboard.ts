import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";
import useStudents from "../Hooks/useStudents";
import useSubjects from "../Hooks/useSubject";


const useDashboard = () => {
    const [ isLoading, setLoading ] = React.useState(true);
    const [ stats, setStats ] = React.useState({
        totalStudents: 0,
        totalStudentsFilter: 0,
        studentPercentIncrease: 0,
        totalSubjects: 0,
        totalSubjectsFilter: 0,
        subjectsPercentIncrease: 0,
    });
    const [ filterLoading, setFilterLoading ] = React.useState({
        isLoadingStudentsFilter: false,
        isLoadingSubjectsFilter: false,
    })
    const [ statsFilter, setStatsFilter ] = React.useState({
        students: "last 30 days",
        subjects: "last 30 days",
    });

    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    const { getTotalStudents } = useStudents();
    const { getTotalSubjects } = useSubjects();


    const getStats = async () => {
        try {
            if(!user) throw new Error;

            const [ studentResp, subjectResp ] = await Promise.all([
                getTotalStudents(),
                getTotalSubjects(),
            ])

            setStats(prev => ({
                ...prev,
                totalStudents: studentResp.data ?? 0,
                totalSubjects: subjectResp.data ?? 0,
            }))

        } catch(error){
            toast.error("Something went wrong loading dashboard stats")
        } finally {
            setLoading(false)
        }
    }

    const getDateRangeFromTimeframe = (timeframe: string): { startDate: Date, endDate: Date } => {
        const now = new Date();
        let startDate: Date;
        let endDate: Date = now;
    
        switch (timeframe.toLowerCase()) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
                break;
            case 'last 7 days':
                startDate = new Date();
                startDate.setDate(now.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'last 30 days':
                startDate = new Date();
                startDate.setDate(now.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);
                break;
            default:
                throw new Error("Invalid timeframe. Use 'today', 'last 7 days', or 'last 30 days'.");
        }
    
        return { startDate, endDate };
    };
    

    const handleStudentFilterChange = async (timeframe: string) => {
        try {
            if(!stats.totalStudents) return;

            setFilterLoading(prev => ({
                ...prev,
                isLoadingStudentsFilter: true
            }))

            setStatsFilter(prev => ({
                ...prev,
                students: timeframe
            }));

            const { startDate, endDate } = getDateRangeFromTimeframe(timeframe)

            const { status, data: totalStudentsByFilter } = await getTotalStudents({ startDate, endDate });

            if(status === "error") throw new Error;

            const studentPercentIncrease = (totalStudentsByFilter / stats.totalStudents) * 100;

            setStats(prev => ({
                ...prev,
                totalStudentsFilter: totalStudentsByFilter,
                studentPercentIncrease
            }))

        } catch(error) {
            toast.error("Something went wrong loading student filters");
        } finally {
            setFilterLoading(prev => ({
                ...prev,
                isLoadingStudentsFilter: false
            }))
        }
    }

    const handleSubjectFilterChange = async (timeframe: string) => {
        try {
            if(!stats.totalSubjects) return;

            setFilterLoading(prev => ({
                ...prev,
                isLoadingSubjectsFilter: true
            }))

            setStatsFilter(prev => ({
                ...prev,
                subjects: timeframe
            }));

            const { startDate, endDate } = getDateRangeFromTimeframe(timeframe)

            const { status, data: totalSubjectsByFilter } = await getTotalStudents({ startDate, endDate });

            if(status === "error") throw new Error;

            const subjectPercentIncrease = (totalSubjectsByFilter / stats.totalStudents) * 100;

            setStats(prev => ({
                ...prev,
                totalStudentsFilter: totalSubjectsByFilter,
                subjectPercentIncrease,
            }))

        } catch(error) {
            toast.error("Something went wrong loading student filters");
        } finally {
            setFilterLoading(prev => ({
                ...prev,
                isLoadingSubjectsFilter: false
            }))
        }
    }

    React.useEffect(() => {
        getStats();
    }, [])

    React.useEffect(() => {
        handleStudentFilterChange("last 30 days");
        handleSubjectFilterChange("last 30 days");
    }, [isLoading])

    return {
        isLoading,
        filterLoading,
        stats,
        statsFilter,
        handleStudentFilterChange,
        handleSubjectFilterChange
    }
}

export default useDashboard;