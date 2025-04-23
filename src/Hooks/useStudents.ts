import { useState, useEffect } from "react";
import { docQr } from "../Logics/docQr_ORGate";
import { getFirebaseData } from "../utils/firebase";
import toast from "react-hot-toast";
import { doc } from "firebase/firestore";
import { db } from "../firebase.config";

let fetchedStudents = [];

const useStudents = ({
    page = 1,
    pageSize = 10,
    shouldGetStudents = true,
    shouldGetStudentSubjects = false,
    shouldStoreCache = true,
    reload = false,
} = {}) => {
    const [students, setStudents] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [ pagination, setPagination ] = useState({})

    const user = JSON.parse(sessionStorage.getItem("user") ?? "null");

    const getStudents = async () => {
        try {
            if (!user) {
                throw new Error("User is not logged in " + user);
            }

            setLoading(true);

            if (fetchedStudents.length > 0 && shouldStoreCache) {
                return setStudents(fetchedStudents);
            }

            const { status, data } = await getFirebaseData({
                collection: "users",
                query: [
                    ["school_id", "==", user.school_id],
                    ["role", "==", "learner"],
                ],
                page,
                pageSize,
            });

            if (status === "error") throw new Error();

            let students = data.users;

            if (shouldGetStudentSubjects) {
                const comboMap = new Map<string, any[]>(); // key = combo string, value = subjects

                // Step 1: Get unique combos
                const uniqueCombos = Array.from(
                    new Set(
                        data.users.map(
                            ({ curriculum, student_class, student_dept }) =>
                                `${curriculum}|${student_class}|${student_dept}`
                        )
                    )
                );

                // Step 2: Fetch subjects for each unique combo
                await Promise.all(
                    uniqueCombos.map(async (combo: any) => {
                        const [curriculum, classId, deptId] = combo.split("|");

                        const classRef = doc(db, "Classes", classId);
                        const deptRef = doc(db, "Department", deptId);

                        const subjects = await getFirebaseData({
                            collection: "Subjects",
                            query: [
                                ["curriculum", "==", curriculum],
                                ["classRef", "==", classRef],
                                ["deptRef", "==", deptRef],
                            ],
                        });

                        comboMap.set(combo, subjects.data.Subjects);
                    })
                );

                // Step 3: Attach subjects to each user
                students = data.users.map((user) => {
                    const { curriculum, student_class, student_dept } = user;
                    const key = `${curriculum}|${student_class}|${student_dept}`;
                    return {
                        ...user,
                        subjects: comboMap.get(key) || [],
                    };
                });
            }

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

    useEffect(() => {
        if (shouldGetStudents) getStudents();
    }, [reload]);

    return {
        students,
        loading,
        pagination,
        getTotalStudents,
    };
};

export default useStudents;
