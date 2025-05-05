import React from "react";
import useStudents from "./useStudents";
import toast from "react-hot-toast";
import { doc, Timestamp } from "firebase/firestore";
import { addBulkFirebaseData, deleteFirebaseData, getFirebaseData } from "../utils/firebase";
import { getCurrentWeekRange } from "../utils";
import { db } from "../firebase.config";
import { useAppContext } from "../context/AppContext";

interface GetAttendanceFilter {
    grade: string;
    subject: string;
    dateFrom: string;
    dateTo: string;
}

const useAttendance = ({ shouldGetAttendance = true }) => {
    const [ statusMap, setStatusMap ] = React.useState(new Map());
    const [ isSaving, setSaving ] = React.useState(false);
    const [ isLoading, setLoading ] = React.useState(true);
    const [ search, setSearch ] = React.useState("");
    const [ inputs, setInputs ] = React.useState({
        grade: "",
        subject: "",
        date: new Date().toISOString().split('T')[0],
    })
    const [ studentAttendance, setStudentAttendance ] = React.useState([]);
    const [ filter, setFilter ] = React.useState({
        page: 1,
        pageSize: 10,
    })
    const [ reload, setReload ] = React.useState(false);
    const [ isAttendanceModalVisible, setAttendanceModalVisible ] = React.useState(false);
    const [ weekHeader, setWeekHeader ] = React.useState("this_week");

    const { students, pagination, loading: isLoadingStudents } = useStudents({ 
        shouldGetStudents: true, 
        pageSize: filter.pageSize, 
        page: filter.page, 
        shouldStoreCache: false,
        reload: reload, 
    });

    const { user } = useAppContext();

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmitAttendance = async () => {
        try {
            const { grade, subject, date } = inputs;

            if (!user) throw new Error("User not logged in");
            if (!grade) throw new Error("Enter grade");
            if (!subject) throw new Error("Enter subject");
            if (!date) throw new Error("Select date");
            if (statusMap.size === 0) throw new Error("No attendance data to submit");

            setSaving(true);

            const attendanceArray = Array.from(statusMap.entries()).map(([student_id, status]) => ({
                student_id,
                teacher_id: user?.teacher_id,
                status,
                date: Timestamp.fromDate(new Date(date)),
                classRef: {
                    isRef: true,
                    collection: "Classes",
                    id: grade
                },
                subjectRef: {
                    isRef: true,
                    collection: "Subjects",
                    id: subject
                },
            }));

            await addBulkFirebaseData({
                collection: "Attendance",
                data: attendanceArray
            })

            setStatusMap(new Map());
            setReload(prev => !prev);
            toggleAttendanceModalVisible();

            toast.success("Attendance has been taken");

        } catch(error){
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    }

    const toggleStatus = React.useCallback((id, status) => {
        setStatusMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, status);
            return newMap;
        });
    }, []);

    const markAllPresent = () => {
        const newMap = new Map();
        students.forEach((s) => newMap.set(s.student_id, "present"));
        setStatusMap(newMap);
    };

    const getAttendance = async (filter?: GetAttendanceFilter) => {
        setLoading(true);
        try {
            if (!students.length) throw new Error("No students defined");
        
            const { dateFrom, dateTo } = getCurrentWeekRange();
            const studentIds = students.map(s => s.student_id);

            let query = [
                ["date", ">=", dateFrom, "timestamp"],
                ["date", "<=", dateTo, "timestamp"],
                ["student_id", "in", studentIds],
            ] as any;

            if(filter){
                query = [
                    ["student_id", "in", studentIds],
                ];

                const { grade, subject, dateFrom, dateTo } = filter;

                if(dateFrom){
                    query.push(
                        ["date", ">=", dateFrom, "timestamp"],
                        ["date", "<=", dateTo, "timestamp"],
                    )
                }

                if(grade){
                    let docRef = doc(db, "Classes", grade);
                    query.push(
                        ["classRef", "==", docRef],
                    )
                }

                if(subject){
                    let docRef = doc(db, "Subjects", subject);
                    query.push(
                        ["subjectRef", "==", docRef],
                    )
                }

            }
            
            const response = await getFirebaseData({
                collection: "Attendance",
                query
            });

            const data = response.data.Attendance;
        
            // group by student
            const byStudent = data.reduce((acc, doc) => {
                (acc[doc.student_id] ??= []).push(doc);
                return acc;
            }, {});
        
            // now you can map each student → their attendance array
            const result = students.map(s => ({
                ...s,
                attendance: byStudent[s.student_id] || []
            }));

            setStudentAttendance(result);
        
            return result;
        } catch (e: any) {
          toast.error(e.message || "Something went wrong getting attendance");
        } finally {
          setLoading(false);
        }
    };

    const handlePaginate = (page: number) => {
        setFilter(prev => ({
            ...prev,
            page
        }))
    }

    const toggleAttendanceModalVisible = () => setAttendanceModalVisible(prev => !prev);

    React.useEffect(() => {
        if(shouldGetAttendance && students.length > 0) getAttendance();
    }, [students])

    React.useEffect(() => {
        (async () => {
            // const attendanceIds = studentAttendance.flatMap(item => item.attendance.map(att => att.id))

            // attendanceIds.forEach(async (item) => {
            //     await deleteFirebaseData({
            //         collection: "Attendance",
            //         id: item
            //     })
            // })
        })()
    }, [students])
      

    return {
        statusMap,
        isSaving,
        isLoading,
        isLoadingStudents,
        search,
        inputs,
        studentAttendance,
        pagination,
        isAttendanceModalVisible,
        weekHeader,
        setWeekHeader,
        getAttendance,
        toggleAttendanceModalVisible,
        handlePaginate,
        setFilter,
        handleInput,
        setSearch,
        handleSubmitAttendance,
        toggleStatus,
        markAllPresent,
    }
}

export default useAttendance;