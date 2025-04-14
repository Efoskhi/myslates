import { doc } from "firebase/firestore";
import React from "react";
import { db } from "../firebase.config";
import { getFirebaseData, updateFirebaseData } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useStudentResults = () => {
    const [ studentResults, setStudentResults ] = React.useState({} as any);
    const [ isLoading, setLoading ] = React.useState(true);
    const [ inputs, setInputs ] = React.useState({
        class_teacher_comment: "",
    });
    const [ isSaving, setSaving ] = React.useState(false);

    const navigate = useNavigate();

    const getStudentResults = async () => {
        try {
            setLoading(true);

            const student = JSON.parse(sessionStorage.getItem("student") ?? "null");

            if(!student) navigate("/students");

            const studentRef = doc(db, 'users', student.uid);

            let response = await getFirebaseData({
                collection: 'StudentResults',
                query: [
                    ['student_ref', '==', studentRef]
                ],
                subcollections: ['ResultSubjects'],
                findOne: true,
            })

            if(response.status === "error") toast.error("No result found for student");

            setStudentResults(response.data.StudentResults);

        } catch(error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const submitToAdmin = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            const { class_teacher_comment } = inputs;
            if(!class_teacher_comment) return toast.error("Please enter your comment");

            const response = await updateFirebaseData({
                collection: "StudentResults",
                id: studentResults.id,
                data: {
                    result_status: "Completed",
                    class_teacher_comment,
                }
            })

            if(response.status === "error") throw new Error;

            toast.success("Result has been submitted to admin");
            setStudentResults(prev => ({
                ...prev,
                result_status: "Completed"
            }))

        } catch(error) {
            toast.error("Something went wrong submitting to admin")
        } finally {
            setSaving(false)
        }
    }

    React.useEffect(() => {
        getStudentResults();
    }, [])

    return {
        isLoading,
        isSaving,
        studentResults,
        inputs,
        handleInput,
        submitToAdmin
    }

}

export default useStudentResults;