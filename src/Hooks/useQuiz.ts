import React from "react";
import toast from "react-hot-toast";
import { addFirebaseData, deleteFirebaseData, updateFirebaseData } from "../utils/firebase";
import { v4 as uuid } from "uuid";

const defaultInputs = {
    question_number: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
} as any;

const useQuizs = () => {
    const [ quizes, setQuizes ] = React.useState([] as any);
    const [ isLoading, setLoading ] = React.useState(true);
    const [ quizModalVisible, setQuizModalVisible ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState(defaultInputs);
    const [ isSaving, setSaving ] = React.useState(false);
    const section = React.useRef("");

    const topic = JSON.parse(sessionStorage.getItem("currentTopic") || "null");

    const getQuizes = () => {
        try {
            
            if(!topic) throw new Error;

            setQuizes(topic.Quizzes);

        } catch(error){
            toast.error("Something went wrong getting quizes");
        } finally {
            setLoading(false);
        }
    }

    const handleInputs = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const toggleQuizModalVisible = (quizSection) => {
        if(quizSection === "Add"){
            setInputs(defaultInputs)
        }

        section.current = quizSection;
        setQuizModalVisible(prev => !prev);
    }

    const handleQuizClick = (quiz) => {
        setInputs(quiz);
        toggleQuizModalVisible("Update");
    }

    const updateTopics = (updatedQuizes) => {
        topic.Quizzes = updatedQuizes;
        sessionStorage.setItem("currentTopic", JSON.stringify(topic));
    }

    const handleAddQuiz = async () => {
        try {
            if(!topic) throw new Error;

            setSaving(true);

            // const totalQuizs = quizes.length;

            validateInput();

            const quiz = {
                ...inputs,
                question_type: "Multiple Choice",
                id: uuid(),
            }

            const { status, message } = await addFirebaseData({
                collection: "Topics",
                successMessage: "",
                subCollectionData: {
                    Quizzes: quiz,
                },
                id: topic.id
            })

            if(status === "error") throw new Error(message);
            
            toast.success("Quiz has been added");

            const updatedQuizs = [quiz, ...quizes];
            setQuizes(updatedQuizs);
            toggleQuizModalVisible("Add");
            updateTopics(updatedQuizs);

        } catch(error) {
            toast.error("Something went wrong adding quiz");
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateQuiz = async () => {
        let errorMessage = "Something went wrong updating quiz";

        try {
            if(!topic) throw new Error;
            setSaving(true);

            validateInput();

            const { status } = await updateFirebaseData({
                collection: "Topics",
                subCollectionData: {
                    Quizzes: inputs,
                },
                id: topic.id,
            })

            if(status === "error") throw new Error(errorMessage);
            
            const updatedQuizs = quizes.map(item => item.id === inputs.id ? {...item, ...inputs} : item);
            toast.success("Quiz has been updated");
            setQuizes(updatedQuizs);
            toggleQuizModalVisible("Add");
            updateTopics(updatedQuizs);

        } catch(error) {
            if(error instanceof Error){
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteQuiz = async (quiz) => {
        let errorMessage = "Something went wrong deleting quiz";

        try {
            setSaving(true);

            const { status, message } = await deleteFirebaseData({
                collection: "Topics",
                id: topic.id,
                subCollectionData: {
                    Quizzes: { id: quiz.id },
                },
                deleteMainDocument: false,
            })

            if(status === "error") throw new Error(message);
            
            const updatedQuizs = quizes.filter(item => item.id !== quiz.id)
            toast.success("Quiz has been deleted");
            setQuizes(updatedQuizs);
            toggleQuizModalVisible("Add");
            updateTopics(updatedQuizs);

        } catch(error) {

            // if(error instanceof Error){
            //     errorMessage = error.message;
            // }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const validateInput = () => {
        const { question_number, question, optionA, optionB, optionC, optionD, answer } = inputs;

        if(!question_number) throw new Error("Enter question number");
        if(!question) throw new Error("Enter question");
        if(!optionA) throw new Error("Enter optionA");
        if(!optionB) throw new Error("Enter optionB");
        if(!optionC) throw new Error("Enter optionC");
        if(!optionD) throw new Error("Enter optionD");
        if(!answer) throw new Error("Enter answer");
    }

    React.useEffect(() => {
        getQuizes();
    }, [])

    return {
        isLoading,
        quizes,
        quizModalVisible,
        section: section.current,
        inputs,
        isSaving,
        handleQuizClick,
        toggleQuizModalVisible,
        handleInputs,
        handleAddQuiz,
        handleUpdateQuiz,
        handleDeleteQuiz,
    }
}

export default useQuizs;