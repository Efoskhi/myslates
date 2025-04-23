import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

let fetchedTerms = [];

const useTerms = ({ shouldGetTerms = false, pageSize = 10 } = {}) => {

    const [ terms, setTerms ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getTerms = async () => {
        try {
            if(fetchedTerms.length > 0){
                return setTerms(fetchedTerms);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Terms",
                page: 1,
                pageSize
            });

            if(status === "error") throw new Error(message);

            setTerms(data.Terms);
            fetchedTerms = data.Terms;

            return data.terms;

        } catch(error) {
            toast.error("Something went wrong getting terms");
            return [];
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(shouldGetTerms) getTerms();
    }, [])

    return {
        isLoading,
        terms,
        getTerms,
    }
}

export default useTerms;