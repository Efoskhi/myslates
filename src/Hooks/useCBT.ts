import React from "react";
import toast from "react-hot-toast";
import { addFirebaseData, deleteFileFromFirebase, deleteFirebaseData, getFirebaseData, updateFirebaseData, uploadFileToFirebase } from "../utils/firebase";
import { useAppContext } from "../context/AppContext";
import { collection, doc, Timestamp } from "firebase/firestore";
import useSubject from "./useSubject";
import useClasses from "./useClasses";
import { db } from "../firebase.config";
import { convertToFirestoreTimestamp } from "../utils";

interface QuestionInputs {
  essay_question: string;
  essay_answer: string;
  fillblank_question: string;
  fillblank_answer: string;

  img_essay_question: File | string;
  img_fillblank_question: File | string;
  img_mc_question: File | string;
  img_option_a: File | string;
  img_option_b: File | string;
  img_option_c: File | string;
  img_option_d: File | string;

  mc_answer: string;
  mc_question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  question_type: string;
  score_point: number;

  id?: string;
}

interface Instanceinputs {
    allowed_time: number;
    class_id: string;
    closing_date: string;
    start_date: string;
    instruction: string;
    subject_id: string;
    thumbnail: File | string;
    title: string;
    exam_url: string;

    id?: string;
  }

interface InputsState {
  instance: Instanceinputs;
  question: QuestionInputs;
}

type InstanceType = 'self' | 'external';

const useCBT = ({ shouldGetInstances, cbtId, shouldGetResults, shoulGetQuestions }) => {
    const [ isOpenAddModal, setIsOpenAddModal ] = React.useState(false);
    const [ isLoading, setIsLoading ] = React.useState(false);
    const [ isSaving, setIsSaving ] = React.useState(false);
    const [ inputs, setInputs ] = React.useState<InputsState>({
        instance: {
            allowed_time: 0,
            class_id: '',
            closing_date: '',
            start_date: '',
            instruction: '',
            subject_id: '',
            thumbnail: '',
            title: '',
            exam_url: '',
        },
        question: {
            essay_question: '',
            essay_answer: '',
            fillblank_question: '',
            fillblank_answer: '',
            img_essay_question: '',
            img_fillblank_question: '',
            img_mc_question: '',
            img_option_a: '',
            img_option_b: '',
            img_option_c: '',
            img_option_d: '',
            mc_answer: '',
            mc_question: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            question_type: 'Multiple Choice',
            score_point: 0,
        }
    });
    const [ instances, setInstances ] = React.useState<any[]>([]);
    const [ instanceData, setInstanceData ] = React.useState({} as any);
    const [ instanceType, setInstanceType ] = React.useState<InstanceType>('external');
    const [ cbtResults, setCbtResults ] = React.useState({} as any);

    const { user } = useAppContext();

    const subjectFilters = [
        ["teacher_id", "!=", user.teacher_id],
        ["curriculum", "==", user.school.curriculum],
        ["school_id", "==", "000000"],
    ];

    const { staticSubjects } = useSubject({ filters: subjectFilters, pageSize: 100, shouldGetStaticSubjects: true });
    const { classes } = useClasses({ pageSize: 100, shouldGetAllClassess: true, shouldGetClasses: true })

    const handleInput = (parentChildKey: string, value: any) => {
        const keys = parentChildKey.split('.');
        const [ parent, child, removeField ] = keys;

        setInputs(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [child]: value,
                ...(keys.length === 3 ? { [removeField]: '' } : {})
            }
        }))
    }

    const validateInstance = async (type: InstanceType) => {
        const { class_id, subject_id, closing_date, start_date, thumbnail, id, ...rest } = inputs.instance;
        let exam_url = inputs.instance.exam_url;
        let allowed_time = inputs.instance.allowed_time;

        if (type === 'external') {
            const url = inputs.instance.exam_url;

            if (!url) {
                throw new Error("Enter exam URL");
            }

            try {
                new URL(url);
            } catch {
                throw new Error("Enter a valid exam URL");
            }
            allowed_time = 0;

        } else {
            exam_url = '';
            
        }

        if(!inputs.instance.subject_id) {
            throw new Error("Select a subject");
        } else if(!inputs.instance.class_id) {
            throw new Error("Select a class");
        } else if(!inputs.instance.title) {
            throw new Error("Enter title");
        } else if(!inputs.instance.instruction) {
            throw new Error("Enter instruction");
        } else if(!inputs.instance.thumbnail) {
            throw new Error("Please upload a thumbnail");
        } else if(!inputs.instance.allowed_time && type === 'self') {
            throw new Error("Enter allowed time");
        } else if(isNaN(inputs.instance.allowed_time) && type === 'self') {
            throw new Error("Enter a valid allowed time");
        } else if(!inputs.instance.closing_date) {
            throw new Error("Enter closing date");
        } else if(!inputs.instance.start_date) {
            throw new Error("Enter closing date");
        } 

        if (!id && !thumbnail as any instanceof File) {
            throw new Error("Please upload a thumbnail");
        }

        const thumbnail_url = typeof thumbnail === "string" 
            ? thumbnail 
            : await uploadFileToFirebase(thumbnail, "cbt");

        const docId = id || doc(collection(db, 'CBT')).id;

        const instanceData = {
            ...rest,
            exam_url,
            allowed_time,
            class_ref: {
                isRef: true,
                collection: 'Classes',
                id: class_id,
            },
            subject_ref: {
                isRef: true,
                collection: 'StaticSubjects',
                id: subject_id,
            },
            teacher_ref: {
                isRef: true,
                collection: 'users',
                id: user.uid
            },
            school_id: user.school.school_id,
            created_time: Timestamp.fromDate(new Date()),
            closing_date: Timestamp.fromDate(new Date(closing_date)),
            start_date: Timestamp.fromDate(new Date(start_date)),
            thumbnail: thumbnail_url,
            id: docId,
        }

        const selectedSubject = staticSubjects.filter((item: any) => item.id === subject_id)[0];
        const selectedClass = classes.filter((item: any) => item.id === class_id)[0];

        const rawData = {
            ...inputs.instance,
            thumbnail: thumbnail_url,
            subject_ref: selectedSubject || {},
            class_ref: selectedClass || {},
            closing_date: convertToFirestoreTimestamp(inputs.instance.closing_date),
            start_date: convertToFirestoreTimestamp(inputs.instance.start_date),
        }

        return { instanceData, id: docId, rawData };
    }

    const handleCreateInstance = async (type: InstanceType) => {
        try {
            setIsSaving(true);
            
            const { instanceData, id, rawData }  = await validateInstance(type);

            const { status, data } = await addFirebaseData({
                collection: 'CBT',
                data: instanceData,
                id,
                addCreateTimestamp: false,
            });

            if(status === "error") {
                return toast.error("Something went wrong creating instance, please try again");
            }

            setInstances(prev => [{...rawData, id: data?.id}, ...prev]);

            setIsOpenAddModal(false);

            toast.success("Instance has been created");

        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong creating instance, try again");
        } finally {
            setIsSaving(false);
        }
    }

    const handleUpdateInstance = async (type: InstanceType) => {
        try {
            setIsSaving(true);

            const { instanceData, id, rawData }  = await validateInstance(type);

            const { status } = await updateFirebaseData({
                collection: 'CBT',
                data: instanceData,
                id,
            });

            if(status === "error") {
                return toast.error("Something went wrong updating instance, please try again");
            }

            setInstances(prev => 
                prev.map(item => item.id === id ? rawData : item));

            setIsOpenAddModal(false);

            toast.success("Instance has been updated");


        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong updating instance, try again");
        } finally {
            setIsSaving(false);
        }
    }

    const getInstances = async () => {
        try {
            setIsLoading(true);

            const teacherRef = doc(db, 'users', user.uid);  

            const { status, data } = await getFirebaseData({
                collection: 'CBT',
                query: [
                    ['school_id', '==', user.school.school_id],
                    ['teacher_ref', '==', teacherRef],
                ],
                refFields: ['subject_ref', 'class_ref'],
            });

            if(status === "error") {
                toast.error("Error getting instances");
            }

            setInstances(data.CBT);

        } catch(error) {
            toast.error("Something went wrong getting instances");
        } finally {
            setIsLoading(false);
        }
    }

    const getInstanceWithQuestions = async () => {
        try {
            setIsLoading(true);

            const teacherRef = doc(db, 'users', user.uid);  

            const { status, data } = await getFirebaseData({
                collection: 'CBT',
                query: [
                    ['school_id', '==', user.school.school_id],
                    ['teacher_ref', '==', teacherRef],
                    ['__name__', '==', cbtId],
                ],
                refFields: ['subject_ref'],
                subcollections: ['CBT_Question'],
                findOne: true,
            });

            if(status === "error") {
                toast.error("Error getting instances");
            }
            
            setInstanceData(data.CBT);

        } catch(error) {
            toast.error("Failed to get instance data");
        } finally {
            setIsLoading(false);
        }
    }

    const resetQuestionFields = (
        question: Record<string, any>,
        exclude: string[] = []
        ): Record<string, any> => {
        return Object.entries(question).reduce((acc, [key, value]) => {
            acc[key] = exclude.includes(key)
            ? value // preserve excluded fields
            : typeof value === 'number'
                ? 0
                : ''; // reset string fields
            return acc;
        }, {} as Record<string, any>);
    }

    const uploadQuestionFiles = async (fields) => {
        // 1. Map all image fields
        const fieldToImageMap: Record<string, File | null> = fields;

        // 2. Extract non-null images
        const allImages: File[] = [];
        Object.values(fieldToImageMap).forEach(file => {
            if (file && file instanceof File) allImages.push(file);
        });

        // 3. Upload to Firebase in parallel
        const imageUrls = await Promise.all(
            allImages.map(image => uploadFileToFirebase(image, "cbt"))
        );

        // 4. Map uploaded URLs back to their field names
        const uploadedUrls: Partial<Record<keyof typeof fieldToImageMap, string>> = {};
        let index = 0;

        Object.entries(fieldToImageMap).forEach(([key, file]) => {
            if (file && file instanceof File) {
                uploadedUrls[key as keyof typeof fieldToImageMap] = imageUrls[index++];
            }
        });

        return uploadedUrls;
    }

    const validateInstanceQuestion = async () => {
        const question = inputs.question;
        let score_point = question.score_point;

        if(isNaN(score_point)) {
            throw new Error("Enter a valid score point");
        }

        score_point = Number(score_point);

        if(question.question_type === "Multiple Choice") {
            const {
                mc_question,
                mc_answer,
                img_mc_question,
                option_a,
                option_b,
                option_c,
                option_d,
                img_option_a,
                img_option_b,
                img_option_c,
                img_option_d,
                id,
            } = question;


            if(!mc_question && !img_mc_question) {
                throw new Error("Enter Multiple Choice Question");
            } else if(!option_a && !img_option_a) {
                throw new Error("Enter option A");
            } else if(!option_b && !img_option_b) {
                throw new Error("Enter option B");
            } else if(!option_c && !img_option_c) {
                throw new Error("Enter option C");
            } else if(!option_d && !img_option_d) {
                throw new Error("Enter option D");
            } else if(!mc_answer) {
                throw new Error("Enter Multiple Choice answer");
            } 

            const uploadedUrls = await uploadQuestionFiles({
                img_mc_question,
                img_option_a,
                img_option_b,
                img_option_c,
                img_option_d,
            })

            const validated = {
                // ...resetQuestionFields(inputs.question),
                mc_question,
                mc_answer,
                img_mc_question,
                option_a,
                option_b,
                option_c,
                option_d,
                img_option_a,
                img_option_b,
                img_option_c,
                img_option_d,
                question_type: question.question_type,
                ...uploadedUrls,
                score_point,
            } as QuestionInputs;

            if(id) validated.id = id;

            return validated;
        }

        if(question.question_type === "Essay") {
            const {
                essay_question,
                img_essay_question,
                essay_answer,
                id
            } = question;

            if(!essay_question && !img_essay_question) {
                throw new Error("Enter Essay Question");
            } else if(!essay_answer) {
                throw new Error("Enter Multiple Choice answer");
            } 

            const uploadedUrls = await uploadQuestionFiles({
                img_essay_question,
            })

            const validated = {
                // ...resetQuestionFields(inputs.question),
                essay_question,
                img_essay_question,
                essay_answer,
                question_type: question.question_type,
                ...uploadedUrls,
                score_point,
            } as QuestionInputs;

            if(id) validated.id = id;

            return validated;

        }

         if(question.question_type === "Fill in the Blank") {
            const {
                fillblank_question,
                img_fillblank_question,
                fillblank_answer,
                id,
            } = question;

            if(!fillblank_question && !img_fillblank_question) {
                throw new Error("Enter fill in the blank Question");
            } else if(!fillblank_answer) {
                throw new Error("Enter fill in the blank answer");
            } 

            const uploadedUrls = await uploadQuestionFiles({
                img_fillblank_question,
            })

            const validated = {
                // ...resetQuestionFields(inputs.question),
                fillblank_question,
                img_fillblank_question,
                fillblank_answer,
                question_type: question.question_type,
                ...uploadedUrls,
                score_point,
            } as QuestionInputs;

            if(id) validated.id = id;

            return validated;

        }
    }

    const handleAddInstanceQuestion = async (callback: () => void) => {
        try {
            setIsSaving(true);

            const validated = await validateInstanceQuestion();

            const { status, data } = await addFirebaseData({
                collection: "CBT",
                successMessage: "",
                subCollectionData: {
                    CBT_Question: validated,
                },
                id: cbtId
            })

            if(status === "error") {
                return toast.error("Something went wrong, please try again");
            }

            const createQuestionId = data?.subCollectionResult.CBT_Question[0].id as string;

            setInstanceData(prev => ({
                ...prev,
                CBT_Question: [...prev.CBT_Question, { ...validated, id: createQuestionId }]
            }))

            if(callback) callback();

            toast.success("CBT Question has been added");

        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Failed to add question");
        } finally {
            setIsSaving(false);
        }
    }

    const handleUpdateInstanceQuestion = async (callback: () => void) => {
        try {
            setIsSaving(true);

            const validated = await validateInstanceQuestion();

             const { status } = await updateFirebaseData({
                collection: "CBT",
                subCollectionData: {
                    CBT_Question: validated,
                },
                id: cbtId,
            })

            if(status === "error") {
                return toast.error("Something went wrong, please try again");
            }

            if(callback) callback();

            setInstanceData(prev => ({
                ...prev,
                CBT_Question: prev.CBT_Question.map((item: QuestionInputs) =>
                    item.id === inputs.question.id ? { ...item, ...validated } : item
                ),
            }));

            toast.success("CBT Question has been updated");

        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Failed to update question");
        } finally {
            setIsSaving(false);
        }
    }

    const resetInput = (inputs: Record<string, any>, question_type) => {
        setInputs(prev => ({
            ...prev,
            question: {
                ...resetQuestionFields(inputs) as any,
                question_type
            }
        }))
    }

    const resetInstanceInput = () => {
        setInstanceType('self');
        setInputs(prev => ({
            ...prev,
            instance: resetQuestionFields(inputs.instance) as any
        }))
    }


    const deleteFiles = async (question: QuestionInputs | Instanceinputs) => {
        try {
            const allImages: string[] = [];

            // List of all image-related fields for all question types and instances
            const imageFields: (keyof QuestionInputs | keyof Instanceinputs)[] = [
                'img_mc_question',
                'img_option_a',
                'img_option_b',
                'img_option_c',
                'img_option_d',
                'img_essay_question',
                'img_fillblank_question',
                'thumbnail',
            ];

            imageFields.forEach((field) => {
                const value = question[field];

                if (value) {
                    if (typeof value === 'string') {
                        allImages.push(value);
                    }
                }
            });

            await Promise.all(
                allImages.map(image => deleteFileFromFirebase(image))
            );
        } catch(error) {
            // console.warn("Failed to delete one or more images")
        }
    };


    const handleConfirmQuestionDelete = async (question: QuestionInputs, callback: () => void) => {
        try {
            setIsSaving(true);
            
            const id = question.id;

            const { status } = await deleteFirebaseData({
                collection: "CBT",
                id: cbtId,
                subCollectionData: {
                    CBT_Question: { id },
                },
                deleteMainDocument: false,
            })

            if(status === "error") {
                return toast.error("Something went wrong deleting question");
            }

            deleteFiles(question);

            if(callback) callback();

            setInstanceData(prev => ({
                ...prev,
                CBT_Question: prev.CBT_Question.filter((item: QuestionInputs) => item.id !== id),
            }));

            toast.success("Question has been deleted");

        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Failed to update question");
        } finally {
            setIsSaving(false);
        }
    }

    const handleConfirmInstanceDelete = async (instance: Instanceinputs, callback: () => void) => {
        try {
            setIsSaving(true);

            const id = instance.id as string;

            const { status } = await deleteFirebaseData({
                collection: "CBT",
                id,
            })

            if(status === "error") {
                return toast.error("Something went wrong deleting instance");
            }

            deleteFiles(instance);

            if(callback) callback();

            setInstances(prev => prev.filter(item => item.id !== id));

            toast.success("Instance has been deleted");

        } catch(error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete instance");
        } finally {
            setIsSaving(false);
        }
    }

    const getResults = async () => {
        try {
            setIsLoading(true);

            const teacherRef = doc(db, 'users', user.uid);  

            const { status, data } = await getFirebaseData({
                collection: 'CBT',
                query: [
                    ['school_id', '==', user.school.school_id],
                    ['teacher_ref', '==', teacherRef],
                    ['__name__', '==', cbtId],
                ],
                refFields: ['subject_ref'],
                subcollections: ['CBT_Results'],
                findOne: true,
            });

            if(status === "error") {
                toast.error("Error getting results");
            }

            const cbtResults = await Promise.all(data.CBT?.CBT_Results?.map(async (item) => {
                const studentRef = item.student_ref;

                const { data } = await getFirebaseData({
                    collection: 'users',
                    query: [
                        ['uid', '==', studentRef.id],
                    ],
                    findOne: true,
                });

                let student = null;

                if(data.users) student = data.users;

                return {
                    ...item,
                    student
                };
            }))

            const results = { ...(data.CBT || {} ), CBT_Results: cbtResults || [] };
            
            setCbtResults(results);

        } catch(error) {
            toast.error("Failed to get results data");
        } finally {
            setIsLoading(false);
        }
    }


    React.useEffect(() => {
        if(shouldGetInstances) getInstances();
        if(shoulGetQuestions) getInstanceWithQuestions();
        if(shouldGetResults) getResults();
    }, [])

    return {
        inputs,
        isLoading,
        isSaving,
        subjects: staticSubjects,
        classes,
        instances,
        isOpenAddModal,
        instanceData,
        instanceType,
        cbtResults,
        setIsOpenAddModal,
        handleCreateInstance,
        handleInput,
        handleAddInstanceQuestion,
        resetInput,
        setInputs,
        handleUpdateInstanceQuestion,
        handleConfirmQuestionDelete,
        handleUpdateInstance,
        resetInstanceInput,
        handleConfirmInstanceDelete,
        setInstanceType
    }
}

export type UseCBTReturnType = ReturnType<typeof useCBT>;

export default useCBT;
