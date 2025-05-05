import React from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
    const [ user, setUser ] = React.useState({});
    const [ currentTopic, setCurrentTopic ] = React.useState({});
    const [ currentSubject, setCurrentSubject ] = React.useState({});
    const [ isLoading, setLoading ] = React.useState(true);

    const navigate = useNavigate();

    const persistStorage = (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value))
    }

    const getPersistedStorage = (key) => {
        const value = JSON.parse(sessionStorage.getItem(key));
        return value;
    }

    const removePersistentStorage = (key) => {
        sessionStorage.removeItem(key);
    }

    const handleSetUser = (user) => {
        setUser(user);
        persistStorage("user", user);
    }

    const handleSetCurrentTopic = (topic) => {
        setCurrentTopic(topic);
        persistStorage("currentTopic", topic);
    }

    const handleSetCurrentSubject = (subject) => {
        setCurrentSubject(subject);
        persistStorage("currentSubject", subject);
    }

    const contextValue = {
        user,
        currentTopic,
        currentSubject,
        handleSetUser,
        handleSetCurrentTopic,
        handleSetCurrentSubject,
    }

    const init = () => {
        const user = getPersistedStorage("user");
        const currentSubject = getPersistedStorage("currentSubject");
        const currentTopic = getPersistedStorage("currentTopic");

        if(!user) {
            setLoading(false);
            removePersistentStorage("currentSubject");
            removePersistentStorage("currentTopic");
            navigate("/login");
            return;
        }

        setUser(user);
        setCurrentSubject(currentSubject);
        setCurrentTopic(currentTopic);
        setLoading(false);
    }

    React.useEffect(() => {
        init();
    }, [])

    return (
        <AppContext.Provider value={contextValue}>
            {isLoading ? (
                <p>
                    loading...
                </p>
            ) : (
                <>
                    {children}
                </>
            )}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useContext must be used within an AppContextProvider");
    }

    return context;
};

export default AppContextProvider;