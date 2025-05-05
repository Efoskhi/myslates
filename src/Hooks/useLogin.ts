import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { auth } from "../firebase.config";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { getFirebaseData } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [ isLoading, setLoading ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState({
        email: "",
        password: ""
    })

    const { handleSetUser } = useAppContext();

    const navigate = useNavigate();

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleLogin = async () => {
        let errorMessage = "Invalid email or password";

        try {
            const { email, password } = inputs;
            setLoading(true);

            if(!email) throw new Error("Enter your email");
            if(!password) throw new Error("Enter your password");

            const response = await signInWithEmailAndPassword(auth, email, password);
            const userID = response.user.uid;

            const { status, data } = await getFirebaseData({
                collection: "users",
                query: [
                    ["uid", "==", userID],
                    ["role", "==", "teacher"]
                ],
                findOne: true,
            })

            if(status === "error") throw new Error(errorMessage);

            const { status: schoolStatus, data: schoolData } = await getFirebaseData({
                collection: "Schools",
                query: [["school_id", "==", data.users.school_id]],
                findOne: true,
            })

            if(schoolStatus === "error") throw new Error("Something went wrong logging you in")

            handleSetUser({...data.users, school: schoolData.Schools});
            navigate("/Dashboard");
            
        } catch(error) {
            if(error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage)
        } finally {
            setLoading(false);
        }
    }

    return {
        inputs,
        isLoading,
        handleInput,
        handleLogin,
    }
}

export default useLogin;