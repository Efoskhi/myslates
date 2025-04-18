import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

interface Props {
    shouldGetWeeks: boolean;
}

const defaultProps = {
    shouldGetWeeks: false,
}

let fetchedWeeks = [];

const useWeeks = (props?: Props) => {
    const { shouldGetWeeks } = props || defaultProps;

    const [ weeks, setWeeks ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getWeeks = async () => {
        try {
            if(fetchedWeeks.length > 0){
                return setWeeks(fetchedWeeks);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Weeks"
            });

            if(status === "error") throw new Error(message);

            setWeeks(data.Weeks);
            fetchedWeeks = data.Weeks;

            return data.weeks;

        } catch(error) {
            toast.error("Something went wrong getting weeks");
            return [];
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(shouldGetWeeks) getWeeks();
    }, [])

    return {
        isLoading,
        weeks,
        getWeeks,
    }
}

export default useWeeks;