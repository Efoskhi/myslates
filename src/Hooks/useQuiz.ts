import React from "react";
import toast from "react-hot-toast";
import { addFirebaseData, deleteFirebaseData, updateFirebaseData } from "../utils/firebase";
import { v4 as uuid } from "uuid";
import { QuizError } from "../errors";
import { useAppContext } from "../context/AppContext";

const defaultInputs = {
    question_number: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
} as any;

const useQuizs = ({shouldGetQuiz = true} = {}) => {
    const [ quizes, setQuizes ] = React.useState([] as any);
    const [ isLoading, setLoading ] = React.useState(true);
    const [ quizModalVisible, setQuizModalVisible ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState(defaultInputs);
    const [ isSaving, setSaving ] = React.useState(false);
    const section = React.useRef("");

    const { currentTopic: topic, handleSetCurrentTopic } = useAppContext();

    const getQuizes = () => {
        try {
            
            if(!topic) throw new QuizError;

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
        handleSetCurrentTopic(topic);
    }

    const handleAddQuiz = async (customInput?: any) => {
        let errorMessage = "Something went wrong adding quiz";
        
        try {
            const newTopic = customInput ? customInput.topic : topic;

            if(!newTopic) throw new QuizError;

            setSaving(true);

            const input = customInput ?? inputs;

            // const totalQuizs = quizes.length;

            validateInput(customInput);

            const quiz = {
                ...input,
                question_type: "Multiple Choice",
                id: uuid(),
            }

            const { status, message, data } = await addFirebaseData({
                collection: "Topics",
                successMessage: "",
                subCollectionData: {
                    Quizzes: quiz,
                },
                id: newTopic.id
            })

            if(status === "error") throw new QuizError(errorMessage);

            if(customInput) return { status, message, data }
            
            toast.success("Quiz has been added");

            const updatedQuizs = [quiz, ...quizes];
            setQuizes(updatedQuizs);
            toggleQuizModalVisible("Add");
            updateTopics(updatedQuizs);

        } catch(error) {
            if(customInput) throw new QuizError(error);

            if(error instanceof QuizError){
                errorMessage = error.message
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateQuiz = async () => {
        let errorMessage = "Something went wrong updating quiz";

        try {
            if(!topic) throw new QuizError;
            setSaving(true);

            validateInput();

            const { status } = await updateFirebaseData({
                collection: "Topics",
                subCollectionData: {
                    Quizzes: inputs,
                },
                id: topic.id,
            })

            if(status === "error") throw new QuizError(errorMessage);
            
            const updatedQuizs = quizes.map(item => item.id === inputs.id ? {...item, ...inputs} : item);
            toast.success("Quiz has been updated");
            setQuizes(updatedQuizs);
            toggleQuizModalVisible("Add");
            updateTopics(updatedQuizs);

        } catch(error) {
            if(error instanceof QuizError){
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

            if(status === "error") throw new QuizError(message);
            
            const updatedQuizs = quizes.filter(item => item.id !== quiz.id)
            toast.success("Quiz has been deleted");
            setQuizes(updatedQuizs);
            toggleQuizModalVisible("Add");
            updateTopics(updatedQuizs);

        } catch(error) {

            // if(error instanceof QuizError){
            //     errorMessage = error.message;
            // }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const validateInput = (customInput?: any) => {
        const { question_number, question, optionA, optionB, optionC, optionD, answer } = customInput ?? inputs;

        if(!question_number) throw new QuizError("Enter question number");
        if(!question) throw new QuizError("Enter question");
        if(!optionA) throw new QuizError("Enter optionA");
        if(!optionB) throw new QuizError("Enter optionB");
        if(!optionC) throw new QuizError("Enter optionC");
        if(!optionD) throw new QuizError("Enter optionD");
        if(!answer) throw new QuizError("Enter answer");
    }

    React.useEffect(() => {
        if(shouldGetQuiz) getQuizes();
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
        validateInput,
    }
}

export default useQuizs;