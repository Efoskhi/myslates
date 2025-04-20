import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

interface Props {
    shouldGetCurriculums: boolean;
}

const defaultProps = {
    shouldGetCurriculums: true,
}

let fetchedCurriculums = [];

const useCurriculums = (props?: Props) => {
    const { shouldGetCurriculums } = props || defaultProps;

    const [ curriculums, setCurriculums ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getCurriculums = async () => {
        try {
            if(fetchedCurriculums.length > 0){
                return setCurriculums(fetchedCurriculums);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Curriculum"
            });

            if(status === "error") throw new Error(message);

            setCurriculums(data.Curriculum);
            fetchedCurriculums = data.Curriculum;

            return data.Curriculum;

        } catch(error) {
            toast.error("Something went wrong getting curriculums");
            return [];
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(shouldGetCurriculums) getCurriculums();
    }, [])

    return {
        isLoading,
        curriculums,
        getCurriculums,
    }
}

export default useCurriculums;