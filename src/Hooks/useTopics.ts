import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";
import { useAppContext } from "../context/AppContext";

let fetchedTopics = [];

const useTopics = ({ toggleReloadTopic }) => {
    const [ topics, setTopics ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const { currentSubject: subject } = useAppContext();

    const getTopics = async () => {
        try {
            // if(fetchedTopics?.length){
            //     return setTopics(fetchedTopics);
            // }

            setLoading(true);

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
            const subjects = data.Subjects
                ?.filter(item => item.termRef.is_active)
                .sort((a, b) => a.serial_no - b.serial_no);
                      
            setTopics(subjects);
            fetchedTopics = subjects;

        } catch(error) {
            console.log("error", error)
            toast.error("Something went wrong getting topic, please try again");
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        getTopics();
    }, [toggleReloadTopic])

    return {
        isLoading,
        topics
    }
}

export default useTopics;