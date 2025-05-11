import React, { useState, useEffect } from "react";
import { docQr } from "../Logics/docQr_ORGate";
import { getFirebaseData, getFirebaseInnerCollectionData } from "../utils/firebase";
import toast from "react-hot-toast";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAppContext } from "../context/AppContext";

let fetchedStudents = [];

const useStudents = ({
    page = 1,
    pageSize = 10,
    shouldGetStudents = true,
    shouldGetStudentSubjects = false,
    shouldStoreCache = true,
    reload = false,
    searchFilter = {}
} = {}) => {
    const [students, setStudents] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [ pagination, setPagination ] = useState({});
    const [ filter, setFilter ] = React.useState({ page, pageSize })

    const { user } = useAppContext();
    
    const getStudents = async () => {
        try {
            if (!user) {
                throw new Error("User is not logged in " + user);
            }

            setLoading(true);

            if (fetchedStudents.length > 0 && shouldStoreCache) {
                return setStudents(fetchedStudents);
            }

            page= filter.page,
            pageSize=  filter.pageSize
            const { subject_id } = searchFilter;

            const subjectRef = doc(db, "Subjects", "Governments_SSS 3");

            const { status, data } = await getFirebaseInnerCollectionData({
                collection: 'Topics',
                query: [['subjectRef', '==', subjectRef]],
                innerCollection: 'EnrolledTopics',
                page: filter.page,
                pageSize: filter.pageSize,
                refFields: ['studentRef']
            })

            console.log("EnrolledTopics", data.EnrolledTopics)

            return;

            // const { status, data } = await getFirebaseData({
            //     collection: "users",
            //     query: [
            //         ["school_id", "==", user.school_id],
            //         ["role", "==", "learner"],
            //     ],
            //     page: filter.page,
            //     pageSize: filter.pageSize,
            // });

            // if (status === "error") throw new Error();

            // let students = data.users;

            // if (shouldGetStudentSubjects) {
            //     const comboMap = new Map<string, any[]>(); // key = combo string, value = subjects

            //     // Step 1: Get unique combos
            //     const uniqueCombos = Array.from(
            //         new Set(
            //             data.users.map(
            //                 ({ curriculum, student_class, student_dept }) =>
            //                     `${curriculum}|${student_class}|${student_dept}`
            //             )
            //         )
            //     );

            //     // Step 2: Fetch subjects for each unique combo
            //     await Promise.all(
            //         uniqueCombos.map(async (combo: any) => {
            //             const [curriculum, classId, deptId] = combo.split("|");

            //             const classRef = doc(db, "Classes", classId);
            //             const deptRef = doc(db, "Department", deptId);

            //             const subjects = await getFirebaseData({
            //                 collection: "Subjects",
            //                 query: [
            //                     ["curriculum", "==", curriculum],
            //                     ["classRef", "==", classRef],
            //                     ["deptRef", "==", deptRef],
            //                 ],
            //             });

            //             comboMap.set(combo, subjects.data.Subjects);
            //         })
            //     );

            //     // Step 3: Attach subjects to each user
            //     students = data.users.map((user) => {
            //         const { curriculum, student_class, student_dept } = user;
            //         const key = `${curriculum}|${student_class}|${student_dept}`;
            //         return {
            //             ...user,
            //             subjects: comboMap.get(key) || [],
            //         };
            //     });
            // }

            setPagination(data.pagination);
            setStudents(students);
            fetchedStudents = students;
        } catch (error) {
            toast.error("Something went wrong getting students");
        } finally {
            setLoading(false);
        }
    };

    const getTotalStudents = async (props = {}) => {
        const { startDate, endDate } = props as any;

        let query = [
            ["school_id", "==", user.school_id],
            ["role", "==", "learner"],
        ] as any;

        if (startDate && endDate) {
            query.push(
                ["created_time", ">=", startDate, "timestamp"],
                ["created_time", "<=", endDate, "timestamp"]
            );
        }

        const response = await getFirebaseData({
            collection: "users",
            query,
            countDocuments: true,
        });

        return response;
    };

    const handlePaginate = (page) => {
        setFilter(prev => ({
            ...prev,
            page
        }))
    }

    useEffect(() => {
        if (shouldGetStudents) getStudents();
    }, [reload, filter]);

    useEffect(() => {
        setFilter({ page, pageSize })
    }, [page, pageSize])

    return {
        students,
        loading,
        pagination,
        getTotalStudents,
        handlePaginate,
    };
};

export default useStudents;
