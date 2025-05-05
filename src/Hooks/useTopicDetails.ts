import React from "react";
import useWeeks from "./useWeeks";
import useTerms from "./useTerms";
import toast from "react-hot-toast";
import { addFirebaseData, updateFirebaseData } from "../utils/firebase";
import { TopicError } from "../errors";
import { useAppContext } from "../context/AppContext";

const useTopicDetails = (topic?: any) => {
    const [ inputs, setInputs ] = React.useState({
        week: topic?.weekRef?.title ?? "",
        term: topic?.termRef?.title ?? "",
        title: topic?.title ?? "",
        serial_no: topic?.serial_no ?? "",
        lesson_plan: topic?.lesson_plan ?? "",
    });
    const [ isSaving, setSaving ] = React.useState(false);

    const { weeks, isLoading: isLoadingWeeks } = useWeeks({ shouldGetWeeks: true, pageSize: 100 });
    const { terms, isLoading: isLoadingTerms } = useTerms({ shouldGetTerms: true, pageSize: 100 });

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const { currentSubject, handleSetCurrentTopic } = useAppContext();

    const validateInput = (customInput?: any) => {
        const { week, term, title, serial_no, lesson_plan } = customInput ?? inputs;

        let subject = customInput ? customInput.subject : currentSubject;

        if(!subject) throw new TopicError("Subject could not be validated");

        if(!week) throw new TopicError("Select topic week");
        if(!term) throw new TopicError("Select topic term");
        if(!title) throw new TopicError("Enter title of topic");
        if(!serial_no || isNaN(serial_no)) throw new TopicError("Topic serial number must be a number");
        if(!lesson_plan) throw new TopicError("Enter topic lesson plan");

        const validatedInput = {
            title,
            lesson_plan,
            serial_no: Number(serial_no),
            weekRef: {
                isRef: true,
                collection: "Weeks",
                id: week,
            },
            termRef: {
                isRef: true,
                collection: "Terms",
                id: term
            },
            subjectRef: {
                isRef: true,
                collection: "Subjects",
                id: subject.id,
            }
        }

        return validatedInput
    }

    const updateTopics = (data) => {
        const currentTopic = { ...topic, ...data };
        handleSetCurrentTopic(currentTopic);
    }

    const handleAddTopic = async (customInput?: any) => {
        let errorMessage = "Something went wrong adding topic";

        try {
            setSaving(true);
            const validatedInput = validateInput(customInput);

            const response = await addFirebaseData({
                collection: "Topics",
                data: validatedInput,
                successMessage: ""
            })

            if(response.status === "error") throw new TopicError(errorMessage);

            setInputs({
                week: "",
                term: "",
                title:  "",
                serial_no: "",
                lesson_plan: "",
            })

            if(!customInput) toast.success("Topic has been created");

            return response;

        } catch(error) {
            if(error instanceof TopicError){
                errorMessage = error.message;
            }

            if(customInput) throw new TopicError(error);
                
            toast.error(errorMessage);

            return {
                status: "error",
                message: "",
                data: {}
            }

        } finally {
            setSaving(false)
        }
    }

    const handleUpdateTopic = async () => {
        let errorMessage = "Something went wrong updating topic";

        try {
            setSaving(true);
            const validatedInput = validateInput();

            const response = await updateFirebaseData({
                collection: "Topics",
                data: validatedInput,
                id: topic.id
            })

            if(response.status === "error") throw new TopicError(errorMessage);

            updateTopics(inputs);

            toast.success("Topic has been updated");

        } catch(error) {
            if(error instanceof TopicError){
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }
    
    return {
        weeks,
        isLoadingWeeks,
        terms,
        isLoadingTerms,
        inputs,
        isSaving,
        handleInput,
        handleAddTopic,
        handleUpdateTopic
    }
}

export default useTopicDetails;