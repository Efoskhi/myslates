import React from "react";
import { addFirebaseData, getFirebaseData, updateFirebaseData } from "../utils/firebase";
import { toast } from 'react-hot-toast';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

let fetchedStudents = [];

function getGrade(total: number): string {
    if (total >= 70) return 'A';
    if (total >= 60 && total <= 69) return 'B';
    if (total >= 50 && total <= 59) return 'C';
    if (total >= 46 && total <= 49) return 'D';
    if (total >= 41 && total <= 45) return 'E';
    return 'F';
}
  

const useResultManagement = ({
    shouldGetStudents = true,
    shouldGetPrefetchedStudents = false,
}) => {
    const [students, setStudents] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [pagination, setPagination] = React.useState();
    const [filters, setFilters] = React.useState({
        page: 1,
        pageSize: 100,
    });
    const [isSaving, setSaving] = React.useState(false);
    const [studentResults, setStudentResults] = React.useState([
        { id: 1, student: "", ca1: "", ca2: "", exam: "", remarks: "" },
    ]);

    const currentSubject = JSON.parse(
        sessionStorage.getItem("subject") || "null"
    );

    if (!currentSubject) {
    }
    
    const addMoreStudentResult = () => {
        setStudentResults([
          ...studentResults,
          {
            id: studentResults.length + 1,
            student: "",
            ca1: "",
            ca2: "",
            exam: "",
            remarks: "",
          },
        ]);
    };

    const handleStudentResultInputChange = (id, field, value) => {
        const isDuplicate = studentResults.some(
          (student) => student.student === value
        );
    
        if(isDuplicate){
          return toast.error("Duplicate student identified");
        }
    
        setStudentResults(
            studentResults.map((student) =>
            student.id === id ? { ...student, [field]: value } : student
          )
        );
    };

    const getSubjectStudents = async () => {
        try {
            setLoading(true);

            const response = await getFirebaseData({
                collection: "users",
                query: [
                    [
                        "student_class",
                        "==",
                        currentSubject.classRef.student_class,
                    ],
                    ["student_dept", "==", currentSubject.deptRef.title],
                    ["curriculum", "==", currentSubject.curriculum],
                ],
                page: filters.page,
                pageSize: filters.pageSize,
            });

            if (response.status === "error") throw new Error(response.message);

            const students = response.data.users;
            fetchedStudents = students;
            setStudents(students);
            setPagination(response.data.pagination);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const getPrefetchedStudents = async () => {
        if (fetchedStudents.length > 0) {
            return setStudents(fetchedStudents);
        }

        await getSubjectStudents();
    };

    const handleAddResults = async () => {
        try {
            setSaving(true);
    
            const teacher = JSON.parse(
                sessionStorage.getItem("user") || "null"
            );
    
            if (!teacher) {
                throw new Error(
                    "You are not logged in, kindly login to add result"
                );
            }
    
            for (const item of studentResults) {
                const { ca1, ca2, exam, remarks, student } = item;
    
                if (!ca1 || !ca2 || !exam || !remarks || !student) {
                    toast.error("Please fill in all fields before submitting.");
                    setSaving(false);
                    return;
                }
            }
    
            const results = studentResults.map((item) => {
                const { ca1, ca2, exam, remarks, student } = item;
                const studentDetails = JSON.parse(student);

                return {
                    cleanData: {
                        class_teacher_comment: "",
                        class_teacher_name: teacher.display_name,
                        is_approved: false,
                        number_in_class: students.length,
                        result_status: "Pending",
                        school_id: teacher.school_id,
                        totalScore: ca1 + ca2 + exam,
                        student_class: studentDetails.student_class,
                        student_ref: {
                            isRef: true,
                            collection: "users",
                            id: studentDetails.uid,
                        },
                    },
                    rawData: item,
                    studentDetails,
                };
            });
    
            const response = await Promise.all(
                results.map(async (data) => {
                    let subCollectionData;
                    let subjectData = data.cleanData;

                    const { ca1, ca2, exam, remarks } = data.rawData;
                    const total = ca1 + ca2 + exam;
                    const grade = getGrade(Number(total));

                    subCollectionData = {
                        ResultSubjects: {
                            exam,
                            first_ca: ca1,
                            second_ca: ca2,
                            remark: remarks,
                            grade,
                            total,
                            subject_name: currentSubject.title
                        }
                    }

                    const studentRef = doc(db, 'users', data.studentDetails.uid);

                    let studentResponse = await getFirebaseData({
                        collection: 'StudentResults',
                        query: [
                            ['student_ref', '==', studentRef]
                        ],
                        subcollections: ['ResultSubjects'],
                    })

                    const studentResult = studentResponse.data?.StudentResults;
                    const id = studentResult[0]?.id;
                    const totalResults = studentResult.length;

                    // console.log("totalResults", grandTotal)

                    // return;

                    if(totalResults){
                        let totalFirstCA = 0;
                        let totalSecondCA = 0;
                        let totalExam = 0;

                        studentResult.forEach(entry => {
                            entry.ResultSubjects?.forEach(subject => {
                                totalFirstCA += subject.first_ca || 0;
                                totalSecondCA += subject.second_ca || 0;
                                totalExam += subject.exam || 0;
                            });
                        });

                        const grandTotal = totalFirstCA + totalSecondCA + totalExam + subCollectionData.ResultSubjects.total; // add total of the result to be added

                        await updateFirebaseData({
                            collection: 'StudentResults',
                            data: {
                                total_score: grandTotal,
                            },
                            id
                        })

                        return await addFirebaseData({
                            collection: "StudentResults",
                            successMessage: "",
                            subCollectionData,
                            id
                        })
                    }

                    return await addFirebaseData({
                        collection: "StudentResults",
                        data: subjectData,
                        successMessage: "",
                        subCollectionData,
                    })
                })
            );

            if(response[0].status === "error") throw new Error('Something went wrong uploading result');
    
            toast.success("Results have been uploaded");

            setStudentResults([
                { id: 1, student: "", ca1: "", ca2: "", exam: "", remarks: "" },
            ])
    
        } catch (error) {
            console.log("error", studentResults)
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };
    

    React.useEffect(() => {
        if (shouldGetStudents) getSubjectStudents();
        if (shouldGetPrefetchedStudents) getPrefetchedStudents();
    }, []);

    return {
        isLoading,
        isSaving,
        students,
        pagination,
        subject: currentSubject,
        studentResults,
        handleAddResults,
        addMoreStudentResult,
        handleStudentResultInputChange,
    };
};

export default useResultManagement;
