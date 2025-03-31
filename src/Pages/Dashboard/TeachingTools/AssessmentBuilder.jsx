import  { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import GeneratedQuestions from "../../../components/TeachingTools/GeneratedQuestions";

const AssessmentBuilder = () => {
  const [formData, setFormData] = useState({
    questionType: "Fill in the Blanks",
    grade: "",
    subject: "",
    numQuestions: 1,
    topic: "",
    file: null,
  });

  // This state holds the generated prompt (for debugging, if needed)
  const [prompt, setPrompt] = useState("");

  // This state holds the generated response from the GPT model
  const [generatedResponse, setGeneratedResponse] = useState("");

  // This state holds the loading state while fetching the assignment
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      ["image/jpeg", "image/png", "image/svg+xml"].includes(selectedFile.type)
    ) {
      if (selectedFile.size <= 10 * 1024 * 1024) {
        setFormData((prev) => ({ ...prev, file: selectedFile }));
      } else {
        alert("File size exceeds 10MB limit.");
      }
    } else {
      alert("Invalid file type. Please upload JPEG, PNG, or SVG.");
    }
  };

  const handleGenerate = async () => {
    // Build the assignment prompt using form data
    const {
      numQuestions,
      questionType,
      subject,
      grade,
      topic,
    } = formData;

    // Construct the prompt; note that we're referring to it as an assignment
    const generatedPrompt = `Generate ${numQuestions} ${questionType} assignment questions, for the ${subject} subject for ${grade} level on the ${topic} topic. Each question should have a corresponding answer. Keep to a maximum of 20 question and answer pairs.`;
    setPrompt(generatedPrompt);

    // Build the request body as expected by the GPT API
    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a teaching assistant to help Nigerian teachers generate questions and answers based on the Nigerian curriculum. Your task is to generate assessments that fits the grade level in terms of complexity. Your response should be in markdown format. For example, if the grade level is nursery then the assessment should be suitable for nursery students. Similarly, the plan should be made accordingly if the grade level is a senior secondary school.",
        },
        {
          role: "user",
          content: generatedPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    };

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      console.log({key:import.meta.env.VITE_OPENAI_API_KEY})
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
         },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      // Assuming the response contains the generated content in data.choices[0].message.content
      const generatedText = data?.choices?.[0]?.message?.content || "";
      setGeneratedResponse(generatedText);
    } catch (error) {
      console.error("Error generating assignment:", error);
      setGeneratedResponse("There was an error generating the assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-blue-100 p-6">
      <div className="max-w-5xl w-full bg-white shadow-lg p-6 rounded-lg grid grid-cols-2 gap-6">
        {/* Left Panel - Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Assessment Builder Prompt</h2>
          <div className="space-y-4">
            {/* Question Type */}
            <div>
              <label className="text-xs">Question Type</label>
              <select
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>Fill in the Blanks</option>
                <option>Multiple Choice</option>
                <option>True/False</option>
              </select>
            </div>
            {/* Grade */}
            <div>
              <label className="text-xs">Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Grade</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
                <option>Grade 5</option>
                <option>Grade 6</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>S.S.S 1</option>
                <option>S.S.S 2</option>
                <option>S.S.S 3</option>
              </select>
            </div>
            {/* Subject */}
            <div>
              <label className="text-xs">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Subject</option>
                <option>Math</option>
                <option>Science</option>
                <option>English</option>
                <option>Social Studies</option>
                <option>Economics</option>
              </select>
            </div>
            {/* Question Type & No of Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs">Question Type</label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option>Multiple Choice</option>
                  <option>Fill in the Blanks</option>
                  <option>True/False</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs">No of Questions (max 20)</label>
                <input
                  type="number"
                  name="numQuestions"
                  min="1"
                  max="20"
                  value={formData.numQuestions}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            {/* Topic */}
            <div>
              <label className="text-xs">Topic, Keyword or Description</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                placeholder="Topic, Keyword or Description"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* File Upload */}
            <div className="border bg-[#f3fbf9] rounded-lg flex items-center p-4 justify-between">
              <div className="inline-flex gap-6">
                <div className="p-2 bg-white flex rounded-full">
                  <FiUploadCloud />
                </div>
                <div className="text-xs space-y-1">
                  <label htmlFor="file" className="cursor-pointer">
                    <input
                      type="file"
                      id='file'
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p>Tap to Upload</p>
                  </label>
                  <p className="text-gray-600">JPEG,PNG,SVG | 10MB max.</p>
                </div>
              </div>
              <div className="text-sm text-white py-2 px-4 rounded-md bg-[#0598ce] cursor-pointer">
                Upload
              </div>
            </div>
            {formData.file && (
              <p className="text-sm mt-2">{formData.file.name}</p>
            )}
            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full p-3 bg-[#0598ce] text-white rounded hover:bg-blue-600"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Right Panel - Generated Questions */}
        <div style={{maxHeight:"90vh",overflowY:"auto",overflowX:"hidden"}}>
          <GeneratedQuestions onRegenerate={handleGenerate} generatedResponse={generatedResponse} />
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;
