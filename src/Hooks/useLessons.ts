import React from "react";
import toast from "react-hot-toast";
import { addFirebaseData, deleteFileFromFirebase, deleteFirebaseData, updateFirebaseData, uploadFileToFirebase } from "../utils/firebase";

const defaultInputs = {
    lesson_number: "",
    examples: "",
    activities: "",
    content: "",
    img_content: "",
    img_example: "",
} as any;

const useLessons = () => {
    const [ lessons, setLessons ] = React.useState([] as any);
    const [ isLoading, setLoading ] = React.useState(true);
    const [ lessonModalVisible, setLessonModalVisible ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState(defaultInputs);
    const [ isSaving, setSaving ] = React.useState(false);
    const section = React.useRef("");

    const topic = JSON.parse(sessionStorage.getItem("currentTopic") || "null");

    const getLessons = () => {
        try {
            
            if(!topic) throw new Error;

            setLessons(topic.Lessons);

        } catch(error){
            toast.error("Something went wrong getting lessons");
        } finally {
            setLoading(false);
        }
    }

    const handleInputs = (field: string, value: any) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const toggleLessonModalVisible = (lessonSection) => {
        if(lessonSection === "Add"){
            setInputs(defaultInputs)
        }

        section.current = lessonSection;
        setLessonModalVisible(prev => !prev);
    }

    const handleLessonClick = (lesson) => {
        setInputs(lesson);
        toggleLessonModalVisible("Update");
    }

    const updateTopics = (updatedLessons) => {
        topic.Lessons = updatedLessons;
        sessionStorage.setItem("currentTopic", JSON.stringify(topic));
    }

    const handleAddLesson = async () => {
        try {
            if(!topic) throw new Error;

            setSaving(true);

            const [ img_content, img_example ] = await Promise.all([
                await uploadFileToFirebase(inputs.img_content, "lessons"),
                await uploadFileToFirebase(inputs.img_example, "lessons"),
            ])

            const totalLessons = lessons.length;

            const lesson = {
                ...inputs,
                img_content,
                img_example,
                next: totalLessons + 2,
                previous: totalLessons - 1,
                lesson_number: totalLessons + 1,
                id: `lesson_${totalLessons + 1}`,
                likes: 0,
            }

            const { status, message } = await addFirebaseData({
                collection: "Topics",
                successMessage: "",
                subCollectionData: {
                    Lessons: lesson,
                },
                id: topic.id
            })

            if(status === "error") throw new Error(message);
            
            toast.success("Lesson has been added");

            const updatedLessons = [lesson, ...lessons];
            setLessons(updatedLessons);
            toggleLessonModalVisible("Add");
            updateTopics(updatedLessons);

        } catch(error) {
            toast.error("Something went wrong adding lesson");
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateLesson = async () => {
        let errorMessage = "Something went wrong updating lesson";

        try {
            if(!topic) throw new Error;
            setSaving(true);

            const { activities, content, examples, img_content, img_example } = inputs;

            if(!activities) throw new Error("Enter activity");
            if(!content) throw new Error("Enter content");
            if(!examples) throw new Error("Enter examples");

            let image_content_url;
            let image_example_url;

            if(img_content?.name){
                image_content_url = await uploadFileToFirebase(img_content, "lessons");
            }

            if(img_example?.name){
                image_example_url = await uploadFileToFirebase(img_example, "lessons");
            }

            let lesson = {
                ...inputs,
                img_content: image_content_url,
                img_example: image_example_url,
            };
            
            lesson = Object.fromEntries(
                Object.entries(lesson).filter(([_, v]) => v !== undefined)
            );

            const { status } = await updateFirebaseData({
                collection: "Topics",
                subCollectionData: {
                    Lessons: lesson,
                },
                id: topic.id,
            })

            if(status === "error") throw new Error(errorMessage);
            
            const updatedLessons = lessons.map(item => item.id === lesson.id ? {...item, ...lesson} : item);
            toast.success("Lesson has been updated");
            setLessons(updatedLessons);
            toggleLessonModalVisible("Add");
            updateTopics(updatedLessons);

            // redundant since the img_content is now a file and not a url string

            // if(img_content.name) deleteLessonFile([image_content_url]);
            // if(img_example.name) deleteLessonFile([image_example_url]);

        } catch(error) {
            if(error instanceof Error){
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteLesson = async (lesson) => {
        let errorMessage = "Something went wrong deleting lesson";

        try {
            setSaving(true);

            const { status, message } = await deleteFirebaseData({
                collection: "Topics",
                id: topic.id,
                subCollectionData: {
                    Lessons: { id: lesson.id },
                },
                deleteMainDocument: false,
            })

            if(status === "error") throw new Error(message);

            deleteLessonFile([lesson.img_content, lesson.img_example])
            
            const updatedLessons = lessons.filter(item => item.id !== lesson.id)
            toast.success("Lesson has been deleted");
            setLessons(updatedLessons);
            toggleLessonModalVisible("Add");
            updateTopics(updatedLessons);

        } catch(error) {

            // if(error instanceof Error){
            //     errorMessage = error.message;
            // }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const deleteLessonFile = (files: string[]) => {
        files.forEach(async (file) => {
            deleteFileFromFirebase(file);
        })
    }

    React.useEffect(() => {
        getLessons();
    }, [])

    return {
        isLoading,
        lessons,
        lessonModalVisible,
        section: section.current,
        inputs,
        isSaving,
        handleLessonClick,
        toggleLessonModalVisible,
        handleInputs,
        handleAddLesson,
        handleUpdateLesson,
        handleDeleteLesson,
    }
}

export default useLessons;