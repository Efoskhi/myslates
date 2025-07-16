import React from "react";
import {
  addFirebaseData,
  getFirebaseData,
  updateFirebaseData,
} from "../utils/firebase";
import { toast } from "react-hot-toast";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useAppContext } from "../context/AppContext";
import useSubject from "./useSubject";
import { get } from "http";
import { all } from "axios";

let fetchedStudents = [];

function getGrade(total: number): string {
  if (total >= 70) return "A";
  if (total >= 60 && total <= 69) return "B";
  if (total >= 50 && total <= 59) return "C";
  if (total >= 46 && total <= 49) return "D";
  if (total >= 41 && total <= 45) return "E";
  return "F";
}

const useResultManagement = ({
  shouldGetStudents = true,
  shouldGetPrefetchedStudents = false,
}) => {
  const [students, setStudents] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState();
  const [classes, setClasses] = React.useState<any[]>([]);
  const [allStudents, setAllStudents] = React.useState([]);

  const [filters, setFilters] = React.useState({
    page: 1,
    pageSize: 100,
  });
  const [isSaving, setSaving] = React.useState(false);
  const [studentResults, setStudentResults] = React.useState([
    { id: 1, student: "", ca1: "", ca2: "", exam: "", remarks: "" },
  ]);

  const { currentSubject, user } = useAppContext();

  const { subjectStudents, isLoadingSubjectStudents } = useSubject({
    shouldGetSubjectStudents: true,
  });

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

    if (isDuplicate) {
      return toast.error("Duplicate student identified");
    }

    setStudentResults(
      studentResults.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const getSubjectStudents = async () => {
    setLoading(isLoadingSubjectStudents);
    setStudents(subjectStudents);
  };
  const getExistingResult = async (studentId, term, session) => {
    const studentRef = doc(db, "users", studentId);

    // 1. Get existing result for this student/term/session
    const studentPrevious = await getFirebaseData({
      query: [
        ["student_ref", "==", studentRef],
      ],
      collection: "StudentResults",
      subcollections: ["ResultSubjects"],
    });

    const existingResult = studentPrevious?.data?.StudentResults?.[0];
    const existingSubjects = existingResult?.ResultSubjects || [];
    const previousSubjects = existingSubjects.map((subject) => ({
      ...subject,
    }));
    return previousSubjects;
  };

  const getStudents = async (student_class, fetchAll) => {
    if (!fetchAll && !student_class) return;

    let query = [
      ["school_id", "==", user.school_id],
      ["role", "==", "learner"],
      ...(fetchAll
        ? [["student_class", "!=", student_class]]
        : [["student_class", "==", student_class]]),
    ];
    const studentsSnapshot = await getFirebaseData({
      collection: "users",
      query: query as any,
      pageSize: Infinity,
    });

    const _students = studentsSnapshot.data?.users || [];
    setAllStudents(_students);
    return _students;
  };
  const getClassesAndCategories = async () => {
    const classesSnapshot = await getDocs(
      query(collection(db, "Classes"), where("category", "==", "Nigerian"))
    );
    const _classes: any[] = [];
    classesSnapshot.forEach((doc) => {
      _classes.push({ id: doc.id, ...doc.data() });
    });
    setClasses(_classes);
  };
  const getPrefetchedStudents = async () => {
    if (fetchedStudents.length > 0) {
      return setStudents(fetchedStudents);
    }

    await getSubjectStudents();
  };
  const handleAddStudentResults = async ({
    result,
    classTeacherComment,
    className,
    term,
    selectedSession,
    studentId,
    studentLength,
  }) => {
    if (!result || result.length === 0) return;
    console.log(result);
    let total = 0;
    let totalAverage = 0;
    const realSubjectdata: any[] = [];

    const studentRef = doc(db, "users", studentId);

    // 1. Get existing result for this student/term/session
    const studentPrevious = await getFirebaseData({
      query: [
        ["student_ref", "==", studentRef],
      
      ],
      collection: "StudentResults",
      subcollections: ["ResultSubjects"],
    });

    const existingResult = studentPrevious?.data?.StudentResults?.[0];
    const existingSubjects = existingResult?.ResultSubjects || [];
    const existingResultId = existingResult?.id;
    // 2. Calculate total + build subject data
    for (let i = 0; i < result.length; i++) {
      const { ca1, ca2, subjectName, exam, remark } = result[i];
      const score = Number(ca1) + Number(ca2) + Number(exam);

      realSubjectdata.push({
        subject_name: subjectName,
        exam,
        first_ca: ca1,
        second_ca: ca2,
        total: score,
        grade: getGrade(score),
        remark,
      });
    }
    // Convert existing subjects to a map
    const subjectMap = new Map();

    for (const subj of existingSubjects) {
      if (subj?.subject_name) {
        subjectMap.set(subj.subject_name, subj);
      }
    }

    // Overwrite or add with new subjects
    for (const newSubj of realSubjectdata) {
      subjectMap.set(newSubj.subject_name, newSubj);
    }

    // Final merged subjects
    const mergedSubjects = Array.from(subjectMap.values());

    for (const subject of mergedSubjects) {
      total += Number(subject.total || 0);
    }

    const average =
      mergedSubjects.length > 0 ? total / mergedSubjects.length : 0;

    totalAverage = average;

    const studentData = {
      class_teacher_comment: classTeacherComment,
      class_teacher_name: user.display_name,
      head_teacher_comment: "",
      is_approved: false,
      number_in_class: studentLength,
      result_status: "Pending",
      school_id: user.school_id,
      student_class: className,
      session: selectedSession,
      next_term_begin: "",
      term_ending: "",
      student_ref: studentRef,
      term,
      totalScore: total,
      finalAverage: totalAverage,
    };

    // 3. Upsert StudentResult (no random ID)
    let resultResponse;
    if (existingResultId) {
      console.log("here", existingResultId);
      // Manually update using Firestore
      resultResponse = await addFirebaseData({
        collection: "StudentResults",
        data: studentData,
      });
      resultResponse = {
        status: "success",
        data: {
          id: existingResultId,
          ...studentData,
        },
      };
      console.log("herex")
    } else {
      console.log("here 2");
      // Create new one
      resultResponse = await addFirebaseData({
        collection: "StudentResults",
        data: studentData,
      });
    }

    const resultId = existingResultId || resultResponse?.data?.id;
    console.log(resultId);
    if (!resultId) return;

    // 4. Add or Update each subject by subject_name
    for (let subject of realSubjectdata) {
      const existingSub = existingSubjects.find(
        (s) => s.subject_name === subject.subject_name
      );
      const subjectDocId = existingSub?.id || subject.subject_name;

      const subjectDocRef = doc(
        db,
        "StudentResults",
        resultId,
        "ResultSubjects",
        subjectDocId
      );

      let response6 = await setDoc(subjectDocRef, subject, { merge: true });

      console.log("Updated subject:", subjectDocId);

      console.log(response6);
    }
  };

  const getSubjectsList = async (school_id) => {
    const response = await getFirebaseData({
      collection: "Subjects",
      refFields: ["classRef", "deptRef"],
      query: [["school_id", "==", school_id]],
      pageSize: Infinity,
    });
    return response.data;
  };
  const handleAddResults = async () => {
    try {
      setSaving(true);

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
            class_teacher_name: user.display_name,
            is_approved: false,
            number_in_class: students.length,
            result_status: "Pending",
            school_id: user.school_id,
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
              subject_name: currentSubject.title,
            },
          };

          const studentRef = doc(db, "users", data.studentDetails.uid);

          let studentResponse = await getFirebaseData({
            collection: "StudentResults",
            query: [["student_ref", "==", studentRef]],
            subcollections: ["ResultSubjects"],
          });

          const studentResult = studentResponse.data?.StudentResults;
          const id = studentResult[0]?.id;
          const totalResults = studentResult.length;

          // console.log("totalResults", grandTotal)

          // return;

          if (totalResults) {
            let totalFirstCA = 0;
            let totalSecondCA = 0;
            let totalExam = 0;

            studentResult.forEach((entry) => {
              entry.ResultSubjects?.forEach((subject) => {
                totalFirstCA += subject.first_ca || 0;
                totalSecondCA += subject.second_ca || 0;
                totalExam += subject.exam || 0;
              });
            });

            const grandTotal =
              totalFirstCA +
              totalSecondCA +
              totalExam +
              subCollectionData.ResultSubjects.total; // add total of the result to be added

            await updateFirebaseData({
              collection: "StudentResults",
              data: {
                total_score: grandTotal,
              },
              id,
            });

            return await addFirebaseData({
              collection: "StudentResults",
              successMessage: "",
              subCollectionData,
              id,
            });
          }

          return await addFirebaseData({
            collection: "StudentResults",
            data: subjectData,
            successMessage: "",
            subCollectionData,
          });
        })
      );

      if (response[0].status === "error")
        throw new Error("Something went wrong uploading result");

      toast.success("Results have been uploaded");

      setStudentResults([
        { id: 1, student: "", ca1: "", ca2: "", exam: "", remarks: "" },
      ]);
    } catch (error) {
      console.log("error", studentResults);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    if (shouldGetPrefetchedStudents) getPrefetchedStudents();
  }, []);

  React.useEffect(() => {
    if (shouldGetStudents) getSubjectStudents();
  }, [isLoadingSubjectStudents]);

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
    classes,
    getStudents,
    allStudents,
    getClassesAndCategories,
    getSubjectsList,
    handleAddStudentResults,
    getExistingResult
  };
};

export default useResultManagement;
