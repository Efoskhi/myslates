import React from "react";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";

interface Props {
    shouldGetTerms: boolean;
}

const defaultProps = {
    shouldGetTerms: false,
}

let fetchedTerms = [];

const useTerms = (props?: Props) => {
    const { shouldGetTerms } = props || defaultProps;

    const [ terms, setTerms ] = React.useState([]);
    const [ isLoading, setLoading ] = React.useState(true);

    const getTerms = async () => {
        try {
            if(fetchedTerms.length > 0){
                return setTerms(fetchedTerms);
            }
            
            const { status, message, data } = await getFirebaseData({
                collection: "Terms"
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