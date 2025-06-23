import React from "react";
import toast from "react-hot-toast";
import { addFirebaseData, deleteFileFromFirebase, deleteFirebaseData, updateFirebaseData, uploadFileToFirebase } from "../utils/firebase";
import { LessonError } from "../errors";
import { useAppContext } from "../context/AppContext";

const defaultInputs = {
    lesson_number: "",
    examples: "",
    activities: "",
    content: "",
    img_content: "",
    img_example: "",
} as any;

const useLessons = ({shouldGetLesson = true} = {}) => {
    const [ lessons, setLessons ] = React.useState([] as any);
    const [ isLoading, setLoading ] = React.useState(true);
    const [ lessonModalVisible, setLessonModalVisible ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState(defaultInputs);
    const [ isSaving, setSaving ] = React.useState(false);
    const section = React.useRef("");

    const { currentTopic: topic, handleSetCurrentTopic } = useAppContext();

    const getLessons = () => {
        try {
            
            if(!topic) throw new LessonError;

            // sort based on lesson number
            const lessons = topic.Lessons?.sort((a, b) => a.lesson_number - b.lesson_number);

            setLessons(lessons);

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
        handleSetCurrentTopic(topic);
    }

    const validateInput = (customInput?: any) => {
        const { activities, content, examples, img_content, img_example } = customInput ?? inputs;

        const newTopic = customInput ? customInput.topic : topic;

        if (!newTopic) throw new LessonError("Topic data was not found");
        // if (!activities) throw new LessonError("Enter lesson activities");
        if (!content) throw new LessonError("Enter lesson content");
        // if (!examples) throw new LessonError("Enter lesson examples");
        // if (!img_content) throw new LessonError("Upload lesson image content");
        // if (!img_example) throw new LessonError("Upload lesson image example");

        return {
            activities,
            content,
            examples,
            img_content,
            img_example
        };
        
    }

    const handleAddLesson = async (customInput?: any) => {
        let errorMessage = "Something went wrong adding lesson";

        try {
            const newTopic = customInput ? customInput.topic : topic;

            const validatedInput = validateInput(customInput);

            setSaving(true);

            let img_content;
            let img_example;

            if(validatedInput.img_content || validatedInput.img_content){
                [ img_content, img_example ] = await Promise.all([
                    await uploadFileToFirebase(validatedInput.img_content, "lessons"),
                    await uploadFileToFirebase(validatedInput.img_example, "lessons"),
                ])
            }

            const totalLessons = lessons.length;

            let lesson = {
                ...validatedInput,
                img_content,
                img_example,
                next: totalLessons + 2,
                previous: totalLessons - 1 < 0 ? 0 : totalLessons - 1,
                lesson_number: totalLessons + 1,
                id: `lesson_${totalLessons + 1}`,
                likes: 0,
            } as any

            lesson = Object.fromEntries(
                Object.entries(lesson).filter(([_, v]) => v !== undefined)
            );

            const { status, message, data } = await addFirebaseData({
                collection: "Topics",
                successMessage: "",
                subCollectionData: {
                    Lessons: lesson,
                },
                id: newTopic.id
            })

            if(status === "error") throw new LessonError(errorMessage);

            if(customInput) return { status, message, data };

            toast.success("Lesson has been added");

            const updatedLessons = [lesson, ...lessons];
            setLessons(updatedLessons);
            toggleLessonModalVisible("Add");
            updateTopics(updatedLessons);

        } catch(error) {
            if(customInput) throw new LessonError(error);

            if(error instanceof LessonError){
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateLesson = async () => {
        let errorMessage = "Something went wrong updating lesson";

        try {
            if(!topic) throw new LessonError;
            setSaving(true);

            const { activities, content, examples, img_content, img_example } = inputs;

            if(!activities) throw new LessonError("Enter activity");
            if(!content) throw new LessonError("Enter content");
            if(!examples) throw new LessonError("Enter examples");

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

            if(status === "error") throw new LessonError(errorMessage);
            
            const updatedLessons = lessons.map(item => item.id === lesson.id ? {...item, ...lesson} : item);
            toast.success("Lesson has been updated");
            setLessons(updatedLessons);
            toggleLessonModalVisible("Add");
            updateTopics(updatedLessons);

            // redundant since the img_content is now a file and not a url string

            // if(img_content.name) deleteLessonFile([image_content_url]);
            // if(img_example.name) deleteLessonFile([image_example_url]);

        } catch(error) {
            if(error instanceof LessonError){
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

            if(status === "error") throw new LessonError(message);

            deleteLessonFile([lesson.img_content, lesson.img_example])
            
            const updatedLessons = lessons.filter(item => item.id !== lesson.id)
            toast.success("Lesson has been deleted");
            setLessons(updatedLessons);
            toggleLessonModalVisible("Add");
            updateTopics(updatedLessons);

        } catch(error) {

            // if(error instanceof LessonError){
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
        if(shouldGetLesson) getLessons();
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
        validateInput,
    }
}

export default useLessons;