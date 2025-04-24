import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";
import { stat } from "fs";
import { getMonthRange } from "../utils";
import { doc } from "firebase/firestore";
import { db } from "../firebase.config";

const useStudentAttendance = (student) => {
    const [ isLoading, setLoading ] = React.useState(true);
    const [ attendance, setAttendance ] = React.useState([]);
    const [ filters, setFilters ] = React.useState({
        month: new Date().toLocaleString('default', { month: 'long' }),
        subject: null,
    })

    const getAttendance = async () => {
        try {
            setLoading(true);


            const { dateFrom, dateTo } = getMonthRange(filters?.month);

            let query = [
                ["date", ">=", dateFrom, "timestamp"],
                ["date", "<=", dateTo, "timestamp"],
                ['student_id', '==', student.student_id],
            ] as any;

    
            if(filters.subject){
                let docRef = doc(db, "Subjects", filters.subject);
                query.push(
                    ["subjectRef", "==", docRef],
                )
            }

            const { status, data } = await getFirebaseData({
                collection: "Attendance",
                query,
            })

            if(status === "error") throw new Error;

            setAttendance(data.Attendance);

        } catch(error) {
            toast.error("Something went wrong getting student attendance")
        } finally {
            setLoading(false);
        }
    }

    const handleFilter = (field: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    React.useEffect(() => {
        getAttendance();
    }, [filters])

    return {
        isLoading,
        attendance,
        filters,
        getAttendance,
        handleFilter
    }
}

export default useStudentAttendance;