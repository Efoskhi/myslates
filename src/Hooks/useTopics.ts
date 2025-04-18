import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

let fetchedTopics = [];

const useTopics = () => {
    const [ topics, setTopics ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getTopics = async () => {
        try {
            if(fetchedTopics?.length){
                return setTopics(fetchedTopics);
            }

            setLoading(true);

            const subject = JSON.parse(sessionStorage.getItem("subject") || "null");

            if(!subject) throw new Error;

            const { status, message, data } = await getFirebaseData({
                collection: "Subjects",
                refFields: ['weekRef', 'termRef'],
                find: {
                    collection: 'Topics',
                    field: 'subjectRef',
                    value: subject.id
                },
                subcollections: ['Lessons', 'Quizzes'],
            });

            if(status === "error") throw new Error(message);

            setTopics(data.Subjects);
            fetchedTopics = data.subjects;

        } catch(error) {
            console.log("error", error)
            toast.error("Something went wrong getting topic, please try again");
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getTopics();
    }, [])

    return {
        isLoading,
        topics
    }
}

export default useTopics;