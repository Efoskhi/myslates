import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

interface Props {
    shouldGetDepartments: boolean;
}

const defaultProps = {
    shouldGetDepartments: true,
}

let fetchedDepartments = [];

const useDepartments = (props?: Props) => {
    const { shouldGetDepartments } = props || defaultProps;

    const [ departments, setDepartments ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getDepartments = async () => {
        try {
            if(fetchedDepartments.length > 0){
                return setDepartments(fetchedDepartments);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Department"
            });

            if(status === "error") throw new Error(message);

            setDepartments(data.Department);
            fetchedDepartments = data.Department;

            return data.Department;

        } catch(error) {
            toast.error("Something went wrong getting departments");
            return [];
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(shouldGetDepartments) getDepartments();
    }, [])

    return {
        isLoading,
        departments,
        getDepartments,
    }
}

export default useDepartments;