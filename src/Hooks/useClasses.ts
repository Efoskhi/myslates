import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";
import { useAppContext } from "../context/AppContext";
import useStudents from "./useStudents";

let fetchedClasses = [];
let fetchedPageSize = 10;

const useClasses = ({ shouldGetClasses = true, pageSize = 100, shouldGetAllClassess = false } = {}) => {

    const [ classes, setClasses ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const { user } = useAppContext();
    const { getTeacherClasses } = useStudents({ shouldGetStudents: false });

    const getClasses = async () => {
        try {
            if(fetchedClasses.length > 0 && fetchedPageSize === pageSize){
                return setClasses(fetchedClasses);
            }

            const classes = await getTeacherClasses();

            let query = [["student_class", "in", classes]] as any;

            if(shouldGetAllClassess){
                query = [["category", "==", user.school.curriculum]]
            }

            if(!classes.length && !shouldGetAllClassess) return;
            
            const { status, message, data } = await getFirebaseData({
                collection: "Classes",
                query,
                page: 1,
                pageSize
            });

            if(status === "error") throw new Error(message);

            setClasses(data.Classes);
            fetchedClasses = data.Classes;
            fetchedPageSize = 10;

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