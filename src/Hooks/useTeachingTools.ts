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
        }
    });
    const [ generatedResponses, setGeneratedResponses ] = React.useState({
        assessmentBuilder: "",
        lessonPlan: "",
    })

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
      

    const generateRequestBody = async ({ userMessage, image }) => {

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

            const payload = await generateRequestBody({
                userMessage: generatedPrompt,
                image: file
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
                image: file
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

    return {
        inputs,
        isLoading,
        generatedResponses,
        handleInput,
        handleGenerateAssesmentBuilder,
        handleGenerateLessonPlan,
    };
};

export default useTeachingTools;
