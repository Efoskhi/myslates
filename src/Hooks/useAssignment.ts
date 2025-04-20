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
import { AssignmentError } from "../errors";

const defaultInputs = {
    assignment_no: "",
    question: "",
    image: "",
    max_mark: "",
    due_date: "",
    className: "",
} as any;

let fetchedAssignments = {} as any;

const useAssignments = ({shouldGetAssignment = true} = {}) => {
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

    const getAssignments = async () => {
        try {
            if (fetchedAssignments[topic.id]) {
                return setAssignments(fetchedAssignments[topic.id]);
            }

            if (!topic) throw new AssignmentError();

            setLoading(true);

            const { status, message, data } = await getFirebaseData({
                collection: "Topics",
                refFields: ["class_ref", "topic_ref"],
                find: {
                    collection: "Assignment",
                    field: "topic_ref",
                    value: topic.id,
                },
            });

            if (status === "error") throw new AssignmentError(message);

            setAssignments(data.Topics);
            fetchedAssignments[topic.id] = data.Topics;
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

    const handleAddAssignment = async (customInput?: any) => {
        try {
            setSaving(true);

            // const totalAssignments = assignments.length;

            const input = customInput ?? inputs;

            const validatedInput = validateInput({}, customInput);

            const imageUrl = await uploadFileToFirebase(
                input.image,
                "assignments"
            );

            const assignment = {
                ...validatedInput,
                image: imageUrl,
            };

            const { status, message, data } = await addFirebaseData({
                collection: "Assignment",
                successMessage: "",
                data: assignment,
            });

            if (status === "error") throw new AssignmentError("Something went wrong adding assignment");

            if(customInput) return { status, message, data };

            toast.success("Assignment has been added");

            const updatedAssignments = [assignment, ...assignments];
            setAssignments(updatedAssignments);
            toggleAssignmentModalVisible("Add");
        } catch (error) {
            if(customInput) throw error;

            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateAssignment = async () => {
        let errorMessage = "Something went wrong updating assignment";

        try {
            if (!topic) throw new AssignmentError();
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
                ...validatedInput,
                image: image_url,
            } as any;

            assignment = Object.fromEntries(
                Object.entries(assignment).filter(([_, v]) => v !== undefined)
            );

            const { status, message } = await updateFirebaseData({
                collection: "Assignment",
                data: assignment,
                id: assignment.id,
            });

            if (status === "error") throw new AssignmentError(errorMessage);

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
            if (error instanceof AssignmentError) {
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

            if (status === "error") throw new AssignmentError(message);

            deleteAssignmentFile([assignment.image]);

            const updatedAssignments = assignments.filter(
                (item) => item.id !== assignment.id
            );
            toast.success("Assignment has been deleted");
            setAssignments(updatedAssignments);
            toggleAssignmentModalVisible("Add");
        } catch (error) {
            // if(error instanceof AssignmentError){
            //     errorMessage = error.message;
            // }

            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const validateInput = (optionalFields = {} as any, customInput?: any) => {
        const {
            className,
            question,
            image,
            due_date,
            max_mark,
            assignment_no,
        } = customInput ?? inputs;

        const topic = customInput ? customInput.topic : JSON.parse(sessionStorage.getItem("currentTopic") || "null");
        const subject = customInput ? customInput.subject : JSON.parse(sessionStorage.getItem("subject") || "null");

        if (!topic) throw new AssignmentError("Topic data was not found");
        if (!user) throw new AssignmentError("User data was not found");
        if (!subject) throw new AssignmentError("Subject was not found");

        if (!assignment_no || isNaN(assignment_no))throw new AssignmentError("Enter a valid assignment number");
        if (!max_mark || isNaN(max_mark)) throw new AssignmentError("Enter a valid maximum mark");
        if (!due_date) throw new AssignmentError("Enter due date");
        if (!className) throw new AssignmentError("Select a class");
        if (!question) throw new AssignmentError("Enter question");
        if (!image && !optionalFields?.image) throw new AssignmentError("Upload an image");
        

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
        if(shouldGetAssignment) getAssignments();
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
        validateInput,
    };
};

export default useAssignments;
