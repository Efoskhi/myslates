import React from "react";
import toast from "react-hot-toast";
import { deleteFileFromFirebase, updateFirebaseData, uploadFileToFirebase } from "../utils/firebase";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

const useSettings = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    const [ inputs, setInputs ] = React.useState({
        profile: {
            display_name: user.display_name,
            email: user.email,
            photo_url: user.photo_url,
            phone_number: user.phone_number,
        },
        password: {
            currentPassword: "",
            newPassword: "",
            retypePassword: "",
        }
    })
    const [ isSaving, setSaving ] = React.useState(false);

    const handleInput = (field: string, value: any) => {
        const [ parentKey, childKey ] = field.split(".");

        setInputs(prev => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: value
            }
        }))
    }

    const handleUpdateProfile = async () => {
        try {
            setSaving(true);
            const { display_name, email, photo_url, phone_number } = inputs.profile;

            if(!display_name) throw new Error("Enter your fullname");
            if(!phone_number) throw new Error("Enter your phone number");
            // if(!email) throw new Error("Enter your email address");

            let newPhotoUrl = photo_url;

            if(typeof photo_url === "object"){
                newPhotoUrl = await uploadFileToFirebase(photo_url, "profile_photos");
            }

            const { status } = await updateFirebaseData({
                collection: "users",
                data: {
                    display_name,
                    phone_number,
                    // email,
                    photo_url: newPhotoUrl
                },
                id: user.uid
            })

            if(typeof photo_url === "object"){
                // const filePath = decodeURIComponent(user.photo_url.split('?')[0].split('/v0/b/')[1].split('/o/')[1]);
                // deleteFileFromFirebase(filePath);
            }

            if(status === "error") throw new Error("Error updating profile");

            const newUser = { ...user };
            newUser.display_name = display_name;
            newUser.phone_number = phone_number;
            newUser.photo_url = newPhotoUrl;

            sessionStorage.setItem("user", JSON.stringify(newUser));

            toast.success("Profile has been updated");

        } catch(error){
            toast.error(error.message || "Something went wrong updating profile");
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async () => {
        try {
            setSaving(true);

            const { currentPassword, newPassword, retypePassword } = inputs.password;

            if(!currentPassword) throw new Error("Enter your current password");
            if(!newPassword) throw new Error("Enter your new password");
            if(!retypePassword) throw new Error("Retype your new password");
            if(!passwordRegex.test(newPassword)) {
                throw new Error("Password must be at least 8 characters, include an uppercase letter and a number")
            }
            if(newPassword !== retypePassword) throw new Error("Passwords does not match");

            const auth = getAuth();
            const currentUser = auth.currentUser;

            if(!currentUser) throw new Error("User is not authenticated");

            const email = currentUser.email ?? "";

            const credential = EmailAuthProvider.credential(email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);

            toast.success("Password has been updated");

            setInputs(prev => ({
                ...prev,
                password: {
                    currentPassword: "",
                    newPassword: "",
                    retypePassword: ""
                }
            }))

        } catch(error){
            let message;

            if (error.message === "Firebase: Error (auth/invalid-credential).") {
                message = "The current password is incorrect.";
            }

            toast.error(message || error.message);

        } finally {
            setSaving(false)
        }
    }

    return {
        inputs,
        isSaving,
        handleInput,
        handleUpdateProfile,
        handleUpdatePassword
    }

}

export default useSettings;