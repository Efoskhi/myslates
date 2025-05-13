import React from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useTeachingTools = () => {
    const [isLoading, setLoading] = React.useState(false);
    const [inputs, setInputs] = React.useState({
        assessmentBuilder: {
            questionType: "",
            grade: "",
            subject: "",
            numQuestions: 1,
            description: "",
            file: null,
        },
        lessonPlan: {
            term: "",
            week: "",
            grade: "",
            subject: "",
            classDuration: "",
            description: "",
            file: null
        },
        feedback: {
            description: "",
            file: ""
        },
        lessonNote: {
            term: "",
            week: "",
            grade: "",
            subject: "",
            classDuration: "",
            description: "",
            file: null,
        },
        rubricBuilder: {
            questionType: "",
            grade: "",
            subject: "",
            totalPoints: 0,
            question: "",
        },
        assignmentBuilder: {
            questionType: "",
            grade: "",
            subject: "",
            numQuestions: 1,
            topic: "",
        },
    });

    const [ generatedResponses, setGeneratedResponses ] = React.useState({
        assessmentBuilder: "",
        lessonPlan: "",
        feedback: "",
        lessonNote: "",
        rubricBuilder: "",
        assignmentBuilder: "",
    });

    const handleInput = (field: string, value: any) => {
        const [parentKey, childKey] = field.split(".");

        setInputs((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: value,
            },
        }));
    };

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
        
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
        
            reader.onerror = () => {
                reject("Failed to read file.");
            };
        
            reader.readAsDataURL(file);
        })
    }
      

    const generateRequestBody = async ({ userMessage, image, systemMessage }) => {

        const messages = [      
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userMessage
                    }
                ],
            },
        ] as any;

        if(systemMessage) {
            messages.push({
                role: "system",
                content: systemMessage,
            })
        }

        if(image){
            const base64Image = await convertImageToBase64(image);
            messages[0].content.push({
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
            })
        }

        const requestBody = {
            model: "gpt-4o",
            messages,
            temperature: 0.7,
            max_tokens: 4096,
        };

        return requestBody;
    };

    const getAIResponse = async (payload) => {
        const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
        const options = {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        }

        const response = await axios.post(`https://api.openai.com/v1/chat/completions`, payload, options);
      
        const text = response.data?.choices?.[0].message.content || "";

        const cleanResponse = text.replace(/\\newline/g, '\\\\');

        return cleanResponse;
    };

    const validateFields = (fields: Record<string, any>) => {
        for (const [key, value] of Object.entries(fields)) {
            if(key === "file") {
                continue;
            }
            if (!value || value.toString().trim() === '') {
                throw new Error(`${key} is required`);
            }
        }
        return true;
    };
      

    const handleGenerateAssesmentBuilder = async () => {
        try {
            setLoading(true);

            validateFields(inputs.assessmentBuilder);

            const { 
                numQuestions, 
                questionType, 
                subject, 
                grade, 
                description,
                file 
            } = inputs.assessmentBuilder;

            const generatedPrompt = `Generate ${numQuestions} ${questionType} assignment questions for the ${subject} subject at the ${grade} level on the topic: ${description}. Each question should include a corresponding answer. Generate exactly ${numQuestions} questions and answers, and do not add any introductory or closing text. Format the output clearly using Markdown, with numbered questions and answers immediately following each question. Use standard Markdown formatting only (e.g., numbered lists, bold, italics) and avoid LaTeX or escape characters like \\\\ or \\n.`;

            // const generatedPrompt = `Generate ${numQuestions} ${questionType} assignment questions for the ${subject} subject at the ${grade} level on the topic: ${description}. Each question should include a corresponding answer. Generate exactly ${numQuestions} questions and answers, and do not add any introductory or closing text.`;

            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: file,
                systemMessage: "You are a teaching assistant to help Nigerian teachers generate questions and answers based on the Nigerian curriculum. Your task is to generate assessments that fits the grade level in terms of complexity. Your response should be in markdown format. For example, if the grade level is nursery then the assessment should be suitable for nursery students. Similarly, the plan should be made accordingly if the grade level is a senior secondary school."
            })

            const text = await getAIResponse(payload);

            setGeneratedResponses(prev => ({
                ...prev,
                assessmentBuilder: text,
            }))

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLessonPlan = async () => {
        try {
            setLoading(true);

            validateFields(inputs.lessonPlan);

            const { 
                term, 
                week, 
                subject, 
                grade, 
                description,
                classDuration,
                file 
            } = inputs.lessonPlan;

            const generatedPrompt = `Generate a detailed lesson plan for a ${grade} level ${subject} class for ${term} Term, Week ${week}. The class duration is ${classDuration} minutes and the topic is: ${description}. The lesson plan should include the following sections: Objectives, Instructional Resources, Introduction, Activities, Assessment Methods, and Closure. Do not add any extra text or formatting outside the lesson plan. Format the output clearly using Markdown with appropriate section headings (e.g., ## Objectives) and bullet points or numbered lists where suitable. Avoid using LaTeX, backslashes, or escape characters.`;
            
            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: file,
                systemMessage: "You are a teaching assistant to help Nigerian teachers generate lesson plans based on the Nigerian curriculum. Your task is to make lesson plans that fit the grade levels. For example, if the grade level is nursery then the plan should be suitable for nursery students. Similarly, the plan should be made accordingly if the grade level is a senior secondary school. Your response should be in markdown format. Follow the following template: A. GENERAL INFORMATION- Term- Week- Subject- Topic- Instructional Resources- Behavioral Objective- Previous Knowledge. B. INTRODUCTION- Preamble- Presentation (based on steps)- Culminating Activities- Conclusion- Assignment Work- Remarks"
            })

            const text = await getAIResponse(payload);

            setGeneratedResponses(prev => ({
                ...prev,
                lessonPlan: text,
            }))

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFeedback = async () => {
        try {
            setLoading(true);

            validateFields(inputs.feedback);

            const { 
                description,
                file 
            } = inputs.feedback;

            const generatedPrompt = `${description}. Do not add any extra text or formatting outside the lesson plan. Format the output clearly using Markdown with appropriate section headings (e.g., ## Objectives) and bullet points or numbered lists where suitable. Avoid using LaTeX, backslashes, or escape characters.`;
            
            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: file,
                systemMessage: null
            })

            const text = await getAIResponse(payload);

            setGeneratedResponses(prev => ({
                ...prev,
                feedback: text,
            }))

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleGenerateLessonNote = async () => {
        try {
            setLoading(true);

            validateFields(inputs.lessonNote);

            const { 
                term, 
                week, 
                subject, 
                grade, 
                description,
                classDuration,
                file,
            } = inputs.lessonNote;

            const generatedPrompt = `Generate a lesson plan for ${grade} level for the ${subject} subject on the ${description} topic. The week is ${week} of the ${term} term. The class will last ${classDuration} minutes. Do not add any extra text or formatting outside the lesson notes. Format the output clearly using Markdown with appropriate section headings (e.g., ## Objectives) and bullet points or numbered lists where suitable. Avoid using LaTeX, backslashes, or escape characters.`;
            
            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: file,
                systemMessage: "You are a teaching assistant to help Nigerian teachers generate lesson notes based on the Nigerian curriculum. Your task is to make lesson notes that fit the grade levels. For example, if the grade level is nursery then the note should be suitable for nursery students. Similarly, the note should be made accordingly if the grade level is a senior secondary school. Your response should be in markdown format. Keep in mind that a lesson note is not a lesson plan, therefore, there is no need for objectives, conclusions, homework, and the likes."
            })

            const text = await getAIResponse(payload);

            setGeneratedResponses(prev => ({
                ...prev,
                lessonNote: text,
            }))

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRubricBuilder = async () => {
        try {
            setLoading(true);

            validateFields(inputs.rubricBuilder);

            const { 
                totalPoints, 
                questionType, 
                subject, 
                grade, 
                question,
            } = inputs.rubricBuilder;

            

            // const generatedPrompt = `Generate ${numQuestions} ${questionType} assignment questions for the ${subject} subject at the ${grade} level on the topic: ${description}. Each question should include a corresponding answer. Generate exactly ${numQuestions} questions and answers, and do not add any introductory or closing text. Format the output clearly using Markdown, with numbered questions and answers immediately following each question. Use standard Markdown formatting only (e.g., numbered lists, bold, italics) and avoid LaTeX or escape characters like \\\\ or \\n.`;

            const generatedPrompt = `Generate the rubric, for the ${subject} subject for ${grade} level. The question is  a ${questionType} and is as follows: ${question}. The total points for the question is ${totalPoints} points."`;

            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: null,
                systemMessage: "You are a teaching assistant to help Nigerian teachers generate questions and answers based on the Nigerian curriculum. Your task is to generate rubric that fits the grade level in terms of complexity."
            })

            const text = await getAIResponse(payload);

            setGeneratedResponses(prev => ({
                ...prev,
                rubricBuilder: text,
            }))

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAssignmentBuilder = async () => {
        try {
            setLoading(true);

            validateFields(inputs.assignmentBuilder);

            const { 
                numQuestions, 
                questionType, 
                subject, 
                grade, 
                topic,
            } = inputs.assignmentBuilder;

            // const generatedPrompt = `Generate ${numQuestions} ${questionType} assignment questions for the ${subject} subject at the ${grade} level on the topic: ${description}. Each question should include a corresponding answer. Generate exactly ${numQuestions} questions and answers, and do not add any introductory or closing text. Format the output clearly using Markdown, with numbered questions and answers immediately following each question. Use standard Markdown formatting only (e.g., numbered lists, bold, italics) and avoid LaTeX or escape characters like \\\\ or \\n.`;

            const generatedPrompt = `Generate ${numQuestions} ${questionType} assignment questions, for the ${subject} subject for ${grade} level on the ${topic} topic. Each question should have a corresponding answer.`;

            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: null,
                systemMessage: "You are a teaching assistant to help Nigerian teachers generate questions and answers based on the Nigerian curriculum. Your task is to generate assessments that fits the grade level in terms of complexity. Your response should be in markdown format. For example, if the grade level is nursery then the assessment should be suitable for nursery students. Similarly, the plan should be made accordingly if the grade level is a senior secondary school."
            })

            const text = await getAIResponse(payload);

            setGeneratedResponses(prev => ({
                ...prev,
                assignmentBuilder: text,
            }))

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        inputs,
        isLoading,
        generatedResponses,
        handleInput,
        handleGenerateAssesmentBuilder,
        handleGenerateLessonPlan,
        handleGenerateFeedback,
        handleGenerateLessonNote,
        handleGenerateRubricBuilder,
        handleGenerateAssignmentBuilder,
    };
};

export default useTeachingTools;
