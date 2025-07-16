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
    filters?: any[];
    shouldGetDistinctSubjects?: boolean;
    shouldGetSubjectStudents?: boolean;
}

const useSubject = ({ shouldGetSubjects = false, pageSize = 10, shouldGetStaticSubjects = false, shouldGetNonCreatedSubjects = false, filters = [], shouldGetDistinctSubjects = false, shouldGetSubjectStudents = false }: SubjectProps = {}) => {
    const [isSaving, setSaving] = React.useState(false);
    const [subjects, setSubjects] = React.useState([]);
    const [staticSubjects, setStaticSubjects] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [ filter, setFilter ] = React.useState({ page: 1, pageSize })
    const [ pagination, setPagination ] = React.useState({});
    const [ subjectStudents, setSubjectStudents ] = React.useState([]);
    const [ isLoadingSubjectStudents, setIsLoadingSubjectStudents ] = React.useState(false);

    const navigate = useNavigate();
    const { addSubject } = useAddSubject();

    const { currentSubject: subject, user } = useAppContext();

    const getSubjects = async () => {
        try {
            setLoading(true);
            if (!user) {
                throw new Error("User is not logged in " + user);
            }

            const { status, data } = await getFirebaseData({
                collection: "users",
                query: [
                    ["uid", "==", user.uid],
                    ["role", "==", "teacher"]
                ],
                findOne: true,
            })

            const subjects = data.users?.tutoring_subjects;
            const formattedSubjects = subjects?.map(item =>
                item.toLowerCase().replace(" - ", "_").replace(/\s+/g, "_")
            );
            if(!filters.length && !formattedSubjects.length) return;

            const response = await getFirebaseData({
              collection: "Subjects",
              refFields: ["classRef", "deptRef"],
              query: filters.length
                ? [["subject_id", "in", formattedSubjects]]
                : [["subject_id", "in", formattedSubjects]],
              page: filter.page,
              pageSize: filter.pageSize,
              orderBy: ["title", "asc"],
            });

            if (response.status === "error") throw new Error(response.message);

            let allSubjects = response.data.Subjects;
            if(shouldGetDistinctSubjects){
                const uniqueByTitle = Array.from(
                    new Map(allSubjects.map(subject => [subject.title, subject])).values()
                );
                  
                allSubjects = uniqueByTitle;
            }

            setSubjects(allSubjects);
            setPagination(response.data.pagination);

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
            const subjectResponse = response.data.StaticSubjects;
            const sortedSubjects = subjectResponse.sort((_a, _b) => {
                let a = _a.name.split("by")[0];
                let b = _b.name.split("by")[0]; 
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })
            setStaticSubjects(sortedSubjects);

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

         const { status, data } = await getFirebaseData({
            collection: "users",
            query: [
                ["uid", "==", user.uid],
                ["role", "==", "teacher"]
            ],
            findOne: true,
        })

        const subjects = data.users?.tutoring_subjects;
        const formattedSubjects = subjects?.map(item =>
            item.toLowerCase().replace(" - ", "_").replace(/\s+/g, "_")
        );

        let query = [
            ["teacher_id", "==", user.teacher_id],
            ["subject_id", "in", formattedSubjects],
        ] as any;

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

    const handlePaginate = (page) => {
        setFilter(prev => ({
            ...prev,
            page
        }))
    }

    const getSubjectStudents = async () => {
        try {
            setIsLoadingSubjectStudents(true);

            const student_class = subject.classRef.student_class;
            const department = subject.deptRef;

            const { data } = await getFirebaseData({
                collection: 'users',
                query: [
                    ['student_class', '==', student_class],
                    ['school_id', '==', user.school_id],
                    ['role', '==', 'learner'],
                    ['student_dept', '==', department.title]
                ]
            })

            const students = data.users;

            setSubjectStudents(students);
        } catch(error) {
            toast.error("Error getting subject students");
        } finally {
            setIsLoadingSubjectStudents(false)
        }

    }

    React.useEffect(() => {
        if(shouldGetStaticSubjects) getStaticSubjects();
        if(shouldGetSubjectStudents) getSubjectStudents();
    }, [])

    React.useEffect(() => {
        if(shouldGetSubjects) getSubjects();
    }, [shouldGetNonCreatedSubjects, filter])

    React.useEffect(() => {
        setFilter(prev => ({ ...prev, pageSize }));
    }, [pageSize])


    return {
        isSaving,
        isLoading,
        subjects,
        staticSubjects,
        searchTerm,
        pagination,
        isLoadingSubjectStudents,
        subjectStudents,
        setFilter,
        handlePaginate,
        setSearchTerm,
        handleDeleteSubject,
        getTotalSubjects,
        handleDuplicateSubject,
    };
};

export default useSubject;
