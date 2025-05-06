import React from "react";
import useTopicDetails from "./useTopicDetails";
import useLessons from "./useLessons";
import useAssignments from "./useAssignment";
import useQuiz from "./useQuiz";
import {
    addFirebaseData,
    deleteFirebaseData,
    uploadFileToFirebase,
} from "../utils/firebase";
import toast from "react-hot-toast";
import {
    AssignmentError,
    LessonError,
    QuizError,
    SubjectError,
    TopicError,
} from "../errors";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";


interface DeleteDataParams {
    id: string;
    collection: string;
}

interface AddSubjectResponses {
    subject?: Record<string, any>;
    topic?: Record<string, any>;
    lesson?: Record<string, any>;
    assignment?: Record<string, any>;
    quiz?: Record<string, any>;
}

interface AddSubjectProps {
    curriculum: string;
    className: string;
    department: string;
    title: string;
    description: string;
    thumbnail: string;
    parentSubjectRef?: {
        isRef: boolean;
        collection: string;
        id: string;
    }
}

const useAddSubject = () => {
    const [isSaving, setSaving] = React.useState(false);
    const [inputs, setInputs] = React.useState({
        subject: {
            curriculum: "",
            className: "",
            department: "",
            title: "",
            description: "",
            thumbnail: "",
        },
        topic: {
            term: "",
            week: "",
            serial_no: "",
            title: "",
            lesson_plan: "",
        },
        lesson: {
            lesson_number: "",
            examples: "",
            activities: "",
            content: "",
            img_content: "",
            img_example: "",
        },
        assignment: {
            assignment_no: "",
            question: "",
            image: "",
            max_mark: "",
            due_date: "",
            className: "",
        },
        quiz: {
            question_number: "",
            question: "",
            optionA: "",
            optionB: "",
            optionC: "",
            optionD: "",
            answer: "",
        },
    });

    const { handleAddTopic } = useTopicDetails();
    const { handleAddLesson } = useLessons({ shouldGetLesson: false });
    const { handleAddAssignment } = useAssignments({ shouldGetAssignment: false });
    const { handleAddQuiz } = useQuiz({ shouldGetQuiz: false });

    const navigate = useNavigate();

    const { user } = useAppContext();

    const handleInput = (fieldKey: string, value: any) => {
        const [parentKey, childKey] = fieldKey.split(".");

        setInputs((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: value,
            },
        }));
    };

    const addSubject = async (fields?: AddSubjectProps) => {
        try {
            const {
                curriculum,
                className,
                department,
                description,
                thumbnail,
                title,
            } = fields ?? inputs.subject;

            if (!curriculum)
                throw new SubjectError("Select subject curriculum");
            if (!className) throw new SubjectError("Select subject class");
            if (!department)
                throw new SubjectError("Select subject department");
            // if (!description)
            //     throw new SubjectError("Enter subject description");
            if (!thumbnail) throw new SubjectError("Upload subject thumbnail");
            if (!title) throw new SubjectError("Enter subject title");

            const thumbnail_url = fields ? thumbnail : await uploadFileToFirebase(
                thumbnail,
                "subjects"
            );

            const validatedData = {
                description,
                title: `${title} by ${user.display_name}`,
                curriculum,
                thumbnail: thumbnail_url,
                classRef: {
                    isRef: true,
                    collection: "Classes",
                    id: className,
                },
                deptRef: {
                    isRef: true,
                    collection: "Department",
                    id: department,
                },
                teacher_id: user.teacher_id,
                school_id: user.school_id,
                parentSubjectRef: fields?.parentSubjectRef || null,
            };

            const response = await addFirebaseData({
                collection: "Subjects",
                data: validatedData,
                successMessage: "",
            });

            if (response.status === "error")
                throw new SubjectError("Something went wrong adding subject");

            return response;
        } catch (error) {
            throw new SubjectError(error.message);
        }
    };

    const handleAddSubject = async () => {
        let responses = {} as AddSubjectResponses;
        setSaving(true);

        try {
            const { data: subject } = await addSubject();
            if (!subject) throw new SubjectError("Could not create subject");
            responses.subject = subject;

            const { data: topic } = await handleAddTopic({
                ...inputs.topic,
                subject,
            });
            if (!topic) throw new TopicError("Could not create topic");
            responses.topic = topic;

            const [lessonRes, assignRes, quizRes] = await Promise.all([
                handleAddLesson({ ...inputs.lesson, topic }),
                handleAddAssignment({ ...inputs.assignment, topic, subject }),
                handleAddQuiz({ ...inputs.quiz, topic }),
            ]);

            responses.lesson = lessonRes?.data;
            responses.assignment = assignRes?.data;
            responses.quiz = quizRes?.data;

            toast.success("Subject has been added");

            navigate("/Subjects");

        } catch (error) {
            rollback(error, responses);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const rollback = async (error: unknown, responses: AddSubjectResponses) => {
        // Build up a list of “delete” ops in reverse order of creation:
        const toDelete: DeleteDataParams[] = [];

        if (responses.quiz) {
            toDelete.push({ collection: "Quizzes", id: responses.quiz.id });
        }
        if (responses.assignment) {
            toDelete.push({
                collection: "Assignments",
                id: responses.assignment.id,
            });
        }
        if (responses.lesson) {
            toDelete.push({ collection: "Lessons", id: responses.lesson.id });
        }
        if (responses.topic) {
            toDelete.push({ collection: "Topics", id: responses.topic.id });
        }
        if (responses.subject) {
            toDelete.push({ collection: "Subjects", id: responses.subject.id });
        }

        // Fire off all deletions in parallel, but wait for them to finish
        await Promise.all(
            toDelete.map((item) =>
                deleteFirebaseData({ collection: item.collection, id: item.id })
            )
        );
    };

    return {
        inputs,
        isSaving,
        handleInput,
        handleAddSubject,
        addSubject,
    };
};

export default useAddSubject;
