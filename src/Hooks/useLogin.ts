import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { auth } from "../firebase.config";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { addFirebaseData, deleteFirebaseData, getFirebaseData } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const [ isLoading, setLoading ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState({
        email: "",
        password: "",
        school_id: "",
        teacher_id: "",
    })

    const { handleSetUser } = useAppContext();

    const navigate = useNavigate();

    const handleInput = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const getSchoolData = async (school_id) => {
         const { status, data } = await getFirebaseData({
            collection: "Schools",
            query: [["school_id", "==", school_id]],
            findOne: true,
        })

        return {
            status,
            data
        }
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

            const { status: schoolStatus, data: schoolData } = await getSchoolData(data?.users?.school_id)

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

    const handleCreateAccount = async () => {
        let errorMessage = "Error creating account";
        try {
            const { school_id, teacher_id, password } = inputs;
            setLoading(true);

            if(!school_id) throw new Error("Enter school id");
            if(!teacher_id) throw new Error("Enter teacher id");
            if(!password) throw new Error("Please enter a password");
            if(password.length < 6) throw new Error("Password must be at least 6 characters");

            const { status, data } = await getFirebaseData({
                collection: "NewTeachers",
                query: [
                    ['school_id', '==', school_id],
                    ['teacher_id', '==', teacher_id],
                ],
                findOne: true
            })

            if(status === "error") throw new Error(errorMessage);

            const userData = data.NewTeachers;

            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
            const uid = userCredential.user.uid;

            const mainUserData = {
                ...userData,
                uid
            }

            await addFirebaseData({
                collection: "users",
                data: mainUserData,
                id: uid
            })

            await deleteFirebaseData({
                collection: "NewTeachers",
                id: userData.id
            })

            const { status: schoolStatus, data: schoolData } = await getSchoolData(school_id);

            if(schoolStatus === "error") throw new Error("Something went wrong logging you in")

            handleSetUser({ ...mainUserData, school: schoolData.Schools });
            navigate("/Dashboard");

        } catch(error) {
            if(error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return {
        inputs,
        isLoading,
        handleInput,
        handleLogin,
        handleCreateAccount,
    }
}

export default useLogin;