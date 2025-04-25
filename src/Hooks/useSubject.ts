import React from "react";
import { SubjectError } from "../errors";
import {
    deleteFileFromFirebase,
    deleteFirebaseData,
    getFirebaseData,
} from "../utils/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSubject = ({ shouldGetSubjects = false, pageSize = 10, shouldGetStaticSubjects = false } = {}) => {
    const [isSaving, setSaving] = React.useState(false);
    const [subjects, setSubjects] = React.useState([]);
    const [staticSubjects, setStaticSubjects] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");

    const navigate = useNavigate();

    const subject = JSON.parse(sessionStorage.getItem("subject") || "null");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    const getSubjects = async () => {
        try {
            setLoading(true);
            if (!user) {
                throw new Error("User is not logged in " + user);
            }

            const response = await getFirebaseData({
                collection: "Subjects",
                refFields: ["classRef", "deptRef"],
                query: [["teacher_id", "==", user.teacher_id]],
                page: 1,
                pageSize,
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

    React.useEffect(() => {
        if(shouldGetSubjects) getSubjects();
        if(shouldGetStaticSubjects) getStaticSubjects();
    }, [])

    return {
        isSaving,
        isLoading,
        subjects,
        staticSubjects,
        searchTerm,
        setSearchTerm,
        handleDeleteSubject,
        getTotalSubjects,
    };
};

export default useSubject;
