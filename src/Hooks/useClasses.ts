import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";
import { useAppContext } from "../context/AppContext";

let fetchedClasses = [];
let fetchedPageSize = 10;

const useClasses = ({ shouldGetClasses = true, pageSize = 100 } = {}) => {

    const [ classes, setClasses ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const { user } = useAppContext();

    const getClasses = async () => {
        try {
            if(fetchedClasses.length > 0 && fetchedPageSize === pageSize){
                return setClasses(fetchedClasses);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Classes",
                query: [["category", "==", user.school.curriculum]],
                page: 1,
                pageSize
            });

            if(status === "error") throw new Error(message);

            setClasses(data.Classes);
            fetchedClasses = data.Classes;
            fetchedPageSize = 10;

            return data.classes;

        } catch(error) {
            console.log(error)
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