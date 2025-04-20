import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

interface Props {
    shouldGetClasses: boolean;
}

const defaultProps = {
    shouldGetClasses: true,
}

let fetchedClasses = [];

const useClasses = (props?: Props) => {
    const { shouldGetClasses } = props || defaultProps;

    const [ classes, setClasses ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getClasses = async () => {
        try {
            if(fetchedClasses.length > 0){
                return setClasses(fetchedClasses);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Classes"
            });

            if(status === "error") throw new Error(message);

            setClasses(data.Classes);
            fetchedClasses = data.Classes;

            return data.classes;

        } catch(error) {
            toast.error("Something went wrong getting classes");
            return [];
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(shouldGetClasses) getClasses();
    }, [])

    return {
        isLoading,
        classes,
        getClasses,
    }
}

export default useClasses;