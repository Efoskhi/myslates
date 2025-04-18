import React from "react";
import toast from "react-hot-toast";
import {
    addFirebaseData,
    deleteFileFromFirebase,
    deleteFirebaseData,
    getFirebaseData,
    updateFirebaseData,
    uploadFileToFirebase,
} from "../utils/firebase";
import { v4 as uuid } from "uuid";
import useClasses from "./useClasses";
import { Timestamp } from "firebase/firestore";

const defaultInputs = {
    assignment_no: "",
    question: "",
    image: "",
    max_mark: "",
    due_date: "",
    className: "",
} as any;

let fetchedAssignments = [];

const useAssignments = () => {
    const [assignments, setAssignments] = React.useState([] as any);
    const [isLoading, setLoading] = React.useState(true);
    const [assignmentModalVisible, setAssignmentModalVisible] =
        React.useState(false);
    const [inputs, setInputs] = React.useState(defaultInputs);
    const [isSaving, setSaving] = React.useState(false);
    const section = React.useRef("");

    const { classes, isLoading: isLoadingClasses } = useClasses({
        shouldGetClasses: true,
    });

    const topic = JSON.parse(sessionStorage.getItem("currentTopic") || "null");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    const subject = JSON.parse(sessionStorage.getItem("subject") || "null");

    const getAssignments = async () => {
        try {
            if (fetchedAssignments?.length) {
                return setAssignments(fetchedAssignments);
            }

            if (!topic) throw new Error();

            setLoading(true);

            const { status, message, data } = await getFirebaseData({
                collection: "Topics",
                refFields: ["class_ref"],
                find: {
                    collection: "Assignment",
                    field: "topic_ref",
                    value: topic.id,
                },
            });

            if (status === "error") throw new Error(message);

            setAssignments(data.Topics);
            fetchedAssignments = data.Topics;
        } catch (error) {
            console.log("error", error);
            toast.error("Something went wrong getting assignments");
        } finally {
            setLoading(false);
        }
    };

    const handleInputs = (field: string, value: any) => {
        setInputs((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleAssignmentModalVisible = (assignmentSection) => {
        if (assignmentSection === "Add") {
            setInputs(defaultInputs);
        }

        section.current = assignmentSection;
        setAssignmentModalVisible((prev) => !prev);
    };

    const handleAssignmentClick = (assignment) => {
        const {
            id,
            due_date,
            class_ref,
            max_mark,
            question,
            image,
            assignment_no,
        } = assignment;

        const date = new Date(due_date.seconds * 1000);

        const formattedDate = date.toISOString().split("T")[0];

        setInputs({
            id,
            due_date: formattedDate,
            className: class_ref.student_class,
            max_mark,
            question,
            image,
            assignment_no,
        });

        toggleAssignmentModalVisible("Update");
    };

    const updateTopics = (updatedAssignments) => {
        topic.Assignmentzes = updatedAssignments;
        sessionStorage.setItem("currentTopic", JSON.stringify(topic));
    };

    const handleAddAssignment = async () => {
        try {
            if (!topic) throw new Error();

            setSaving(true);

            // const totalAssignments = assignments.length;

            const validatedInput = validateInput();

            const imageUrl = await uploadFileToFirebase(
                inputs.image,
                "assignments"
            );

            const assignment = {
                ...validatedInput,
                image: imageUrl,
            };

            const { status, message } = await addFirebaseData({
                collection: "Assignment",
                successMessage: "",
                data: assignment,
            });

            if (status === "error")
                throw new Error("Something went wrong adding assignment");

            toast.success("Assignment has been added");

            const updatedAssignments = [assignment, ...assignments];
            setAssignments(updatedAssignments);
            toggleAssignmentModalVisible("Add");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateAssignment = async () => {
        let errorMessage = "Something went wrong updating assignment";

        try {
            if (!topic) throw new Error();
            setSaving(true);

            const validatedInput = validateInput({ image: true });

            let image_url;

            if (inputs.image.name) {
                image_url = await uploadFileToFirebase(
                    inputs.image,
                    "assignments"
                );
            }

            let assignment = {
                ...inputs,
                image: image_url,
            };

            assignment = Object.fromEntries(
                Object.entries(assignment).filter(([_, v]) => v !== undefined)
            );

            const { status, message } = await updateFirebaseData({
                collection: "Assignment",
                data: assignment,
                id: assignment.id,
            });

            if (status === "error") throw new Error(errorMessage);

            const updatedAssignments = assignments.map((item) =>
                item.id === assignment.id
                    ? {
                          ...item,
                          ...assignment,
                          due_date: {
                              seconds: Math.floor(
                                  new Date(assignment.due_date).getTime() / 1000
                              ),
                          },
                      }
                    : item
            );

            toast.success("Assignment has been updated");
            setAssignments(updatedAssignments);
            toggleAssignmentModalVisible("Add");
        } catch (error) {
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAssignment = async (assignment) => {
        let errorMessage = "Something went wrong deleting assignment";

        try {
            setSaving(true);

            const { status, message } = await deleteFirebaseData({
                collection: "Assignment",
                id: assignment.id,
            });

            if (status === "error") throw new Error(message);

            deleteAssignmentFile([assignment.image]);

            const updatedAssignments = assignments.filter(
                (item) => item.id !== assignment.id
            );
            toast.success("Assignment has been deleted");
            setAssignments(updatedAssignments);
            toggleAssignmentModalVisible("Add");
        } catch (error) {
            // if(error instanceof Error){
            //     errorMessage = error.message;
            // }

            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const validateInput = (optionalFields = {} as any) => {
        const {
            className,
            question,
            image,
            due_date,
            max_mark,
            assignment_no,
        } = inputs;

        if (!topic) throw new Error("Topic data was not found");
        if (!user) throw new Error("User data was not found");
        if (!subject) throw new Error("Subject was not found");

        if (!assignment_no || isNaN(max_mark))
            throw new Error("Enter a valid assignment number");
        if (!className) throw new Error("Select a class");
        if (!question) throw new Error("Enter question");
        if (!image && !optionalFields?.image)
            throw new Error("Upload an image");
        if (!due_date) throw new Error("Enter due date");
        if (!max_mark || isNaN(max_mark))
            throw new Error("Enter a valid maximum mark");

        return {
            question,
            max_mark: Number(max_mark),
            assignment_no: Number(assignment_no),
            class_ref: {
                isRef: true,
                collection: "Classes",
                id: className.replace(/\s+/g, ""),
            },
            subject_ref: {
                isRef: true,
                collection: "Subjects",
                id: subject.id,
            },
            teacher_ref: {
                isRef: true,
                collection: "users",
                id: user.uid,
            },
            topic_ref: {
                isRef: true,
                collection: "Topics",
                id: topic.id,
            },
            due_date: Timestamp.fromDate(new Date(due_date)),
        };
    };

    const deleteAssignmentFile = (files: string[]) => {
        files.forEach(async (file) => {
            deleteFileFromFirebase(file);
        });
    };

    React.useEffect(() => {
        getAssignments();
    }, []);

    return {
        classes,
        isLoadingClasses,
        isLoading,
        assignments,
        assignmentModalVisible,
        section: section.current,
        inputs,
        isSaving,
        handleAssignmentClick,
        toggleAssignmentModalVisible,
        handleInputs,
        handleAddAssignment,
        handleUpdateAssignment,
        handleDeleteAssignment,
    };
};

export default useAssignments;
