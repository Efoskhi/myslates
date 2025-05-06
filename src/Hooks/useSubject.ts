import React from "react";
import { SubjectError } from "../errors";
import {
    deleteFileFromFirebase,
    deleteFirebaseData,
    getFirebaseData,
} from "../utils/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAddSubject from "./useAddSubject";
import { useAppContext } from "../context/AppContext";

interface SubjectProps {
    shouldGetSubjects?: boolean;
    pageSize?: number;
    shouldGetStaticSubjects?: boolean;
    shouldGetNonCreatedSubjects?: boolean;
    filters?: [];
}

const useSubject = ({ shouldGetSubjects = false, pageSize = 10, shouldGetStaticSubjects = false, shouldGetNonCreatedSubjects = false, filters = [] }: SubjectProps = {}) => {
    const [isSaving, setSaving] = React.useState(false);
    const [subjects, setSubjects] = React.useState([]);
    const [staticSubjects, setStaticSubjects] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");

    const navigate = useNavigate();
    const { addSubject } = useAddSubject();

    const { currentSubject: subject, user } = useAppContext();

    const getSubjects = async () => {
        try {
            setLoading(true);
            if (!user) {
                throw new Error("User is not logged in " + user);
            }

            const response = await getFirebaseData({
                collection: "Subjects",
                refFields: ["classRef", "deptRef"],
                query: filters.length ? filters : [["teacher_id", "==", user.teacher_id]],
                page: 1,
                pageSize: filters.length ? 100 : pageSize,
                // orderBy: ['created_date', 'desc'],
            });

            if (response.status === "error") throw new Error(response.message);

            // Replace with your actual fetch logic
            // const subjectsData = await docQr("Subjects", { max: 5000, whereClauses: [{ field: "teacher_id", operator: "==", value: user.teacher_id }] });
            setSubjects(response.data.Subjects);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStaticSubjects = async () => {
        try {
            setLoading(true); 

            const response = await getFirebaseData({
                collection: "StaticSubjects",
                page: 1,
                pageSize: 100,
            });

            if (response.status === "error") throw new Error(response.message);
            
            setStaticSubjects(response.data.StaticSubjects);

        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubject = async () => {
        let errorMessage = "Something went wrong deleting subject";

        try {
            setSaving(true);

            if (!subject) throw new SubjectError("Subject was not found");

            const { status } = await deleteFirebaseData({
                collection: "Subjects",
                id: subject.id,
                subCollection: {
                    collection: "Topics",
                    field: "subjectRef",
                },
            });

            if (status === "error") throw new SubjectError(errorMessage);

            await deleteFileFromFirebase(subject.thumbnail);

            // await Promise.all(topic.Lessons.map(async (item) => {
            //     const { img_content, img_example } = item;
            //     await deleteFileFromFirebase(img_content);
            //     await deleteFileFromFirebase(img_example);
            // }))

            sessionStorage.removeItem("subject");
            sessionStorage.removeItem("currentTopic");
            navigate("/Subjects");

            toast.success("Subject has been deleted");
        } catch (error) {
            if (error instanceof SubjectError) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const getTotalSubjects = async (props = {}) => {
        const { startDate, endDate } = props as any;

        let query = [["teacher_id", "==", user.teacher_id]] as any;

        if(startDate && endDate){
			query.push(
				["created_time", ">=", startDate, "timestamp"],
				["created_time", "<=", endDate, "timestamp"],
			)
		}

		const response = await getFirebaseData({
			collection: "Subjects",
            query,
			countDocuments: true,
		});

		return response;
	}

    const handleDuplicateSubject = async (subject, callback) => {
        try {
            const { curriculum, classRef, deptRef, description,thumbnail, title } = subject;
            setSaving(true);
            await addSubject({
                curriculum,
                description,
                thumbnail,
                title, 
                className: classRef.student_class,
                department: deptRef.title,
                parentSubjectRef: {
                    isRef: true,
                    collection: "Subjects",
                    id: subject.id
                }
            })

            toast.success("Subject has been copied");
            callback();

        } catch(error){
            if(error instanceof SubjectError) {
                return toast.error(error.message);
            }

            toast.error("Something went wrong duplicating subject");
        } finally {
            setSaving(false);
        }
    }

    React.useEffect(() => {
        if(shouldGetStaticSubjects) getStaticSubjects();
    }, [])

    React.useEffect(() => {
        if(shouldGetSubjects) getSubjects();
    }, [shouldGetNonCreatedSubjects])

    return {
        isSaving,
        isLoading,
        subjects,
        staticSubjects,
        searchTerm,
        setSearchTerm,
        handleDeleteSubject,
        getTotalSubjects,
        handleDuplicateSubject,
    };
};

export default useSubject;
