import React from "react";
import useWeeks from "./useWeeks";
import useTerms from "./useTerms";
import toast from "react-hot-toast";
import { addFirebaseData, updateFirebaseData } from "../utils/firebase";

const useTopicDetails = (topic?: any) => {
    const [ inputs, setInputs ] = React.useState({
        week: topic?.weekRef?.title ?? "",
        term: topic?.termRef?.title ?? "",
        title: topic?.title ?? "",
        serial_no: topic?.serial_no ?? "",
    });
    const [ isSaving, setSaving ] = React.useState(false);

    const { weeks, isLoading: isLoadingWeeks } = useWeeks({ shouldGetWeeks: true });
    const { terms, isLoading: isLoadingTerms } = useTerms({ shouldGetTerms: true });

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateInput = () => {
        const { week, term, title, serial_no } = inputs;

        const subject = JSON.parse(sessionStorage.getItem("subject") || "null");

        if(!subject) throw new Error("Subject could not be validated");

        if(!week) throw new Error("Select topic week");
        if(!term) throw new Error("Select topic term");
        if(!title) throw new Error("Enter title of topic");
        if(!serial_no || isNaN(serial_no)) throw new Error("Serial number must be a number");

        const validatedInput = {
            title,
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

    const handleAddTopic = async () => {
        let errorMessage = "Something went wrong adding topic";

        try {
            setSaving(true);
            const validatedInput = validateInput();

            const response = await addFirebaseData({
                collection: "Topics",
                data: validatedInput,
                successMessage: ""
            })

            if(response.status === "error") throw new Error(errorMessage);

            setInputs({
                week: "",
                term: "",
                title:  "",
                serial_no: "",
            })

            toast.success("Topic has been created");

        } catch(error) {
            if(error instanceof Error){
                errorMessage = error.message;
            }

            toast.error(errorMessage);
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

            if(response.status === "error") throw new Error(errorMessage);

            toast.success("Topic has been updated");

        } catch(error) {
            if(error instanceof Error){
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