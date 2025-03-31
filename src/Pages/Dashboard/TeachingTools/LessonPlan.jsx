import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import { HiMiniArrowPath } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { FiUploadCloud } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

const LessonPlan = () => {
  const [formData, setFormData] = useState({
    term: "",
    week: "",
    grade: "",
    subject: "",
    duration: "",
    topic: "",
    file: null,
  });
  const [prompt, setPrompt] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
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
    const { term, week, grade, subject, duration, topic } = formData;
    const generatedPrompt = `Generate a detailed lesson plan for a ${grade} level ${subject} class for ${term} Term, Week ${week}. The class duration is ${duration} minutes and the topic is: ${topic}. The lesson plan should include objectives, instructional resources, activities, assessment methods, and a brief introduction. Provide the lesson plan in markdown format.`;
    setPrompt(generatedPrompt);

    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a teaching assistant to help Nigerian teachers generate detailed lesson plans based on the Nigerian curriculum. Your lesson plans should be comprehensive, suitable for the specified grade level, and in markdown format.",
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
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      const generatedText = data?.choices?.[0]?.message?.content || "";
      setGeneratedResponse(generatedText);
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      setGeneratedResponse(
        "There was an error generating the lesson plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResponse);
    alert("Lesson plan copied to clipboard!");
  };

  const regenerateLessonPlan = () => {
    handleGenerate();
  };

  const downloadAsPDF = () => {
    // Simple download as PDF using a blob. For production use a proper PDF generator.
    const element = document.createElement("a");
    const file = new Blob([generatedResponse], { type: "application/pdf" });
    element.href = URL.createObjectURL(file);
    element.download = "lesson-plan.pdf";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen">
        {/* Left Side: Lesson Plan Generator */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-full lg:w-1/3">
          <h2 className="text-lg font-semibold mb-4">Lesson Plan Generator</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Term</option>
                <option value="1st">1st Term</option>
                <option value="2nd">2nd Term</option>
                <option value="3rd">3rd Term</option>
              </select>
              <select
                name="week"
                value={formData.week}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Week</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
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
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            >
              <option value="">Select Subject</option>
              <option>Math</option>
              <option>Science</option>
              <option>English</option>
              <option>Social Studies</option>
              <option>Economics</option>
              <option>Biology</option>
              <option>Chemistry</option>
            </select>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Class Duration (mins)"
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Topic, Keyword or Description"
              className="border rounded-lg p-2 w-full"
            />
            {/* File Upload */}
            <div className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer">
              <label htmlFor="file" className="cursor-pointer">
                <p className="text-gray-500 text-sm">Tap to Upload</p>
                <p className="text-xs text-gray-400">JPEG, PNG, SVG | 10MB max.</p>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <button
              onClick={handleGenerate}
              className="w-full bg-[#0598CE] text-white py-2 rounded-lg hover:bg-blue-600"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Right Side: Generated Lesson Plan */}
        <div
          className="bg-white p-6 shadow-lg rounded-lg w-full lg:w-2/3"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <h2 className="text-lg font-semibold mb-4">Generated Lesson Plan</h2>
          <div className="border p-4 rounded-lg">
            {generatedResponse ? (
              <ReactMarkdown>{generatedResponse}</ReactMarkdown>
            ) : (
              <p className="text-gray-500">
                Your generated lesson plan will appear here.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={regenerateLessonPlan}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 inline-flex gap-2 items-center"
            >
              <HiMiniArrowPath /> Regenerate
            </button>
            <button
              onClick={copyToClipboard}
              className="bg-[#0598CE] text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-flex gap-2 items-center"
            >
              <IoCopyOutline /> Copy
            </button>
            <button
              onClick={downloadAsPDF}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 inline-flex gap-2 items-center"
            >
              <LuDownload /> Download as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlan;
