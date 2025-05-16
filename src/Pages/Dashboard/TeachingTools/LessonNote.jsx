import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import { HiMiniArrowPath } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { FiUploadCloud } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import useTeachingTools from "../../../Hooks/useTeachingTools";
import useSubjects from "../../../Hooks/useSubject";
import useClasses from "../../../Hooks/useClasses";
import useWeeks from "../../../Hooks/useWeeks";
import useTerms from "../../../Hooks/useTerms";
import Loading from "../../../components/Layout/Loading";
import GeneratedQuestions from "../../../components/TeachingTools/GeneratedQuestions";

const LessonNote = () => {
  const { inputs, isLoading, generatedResponses, handleInput, handleGenerateLessonNote } = useTeachingTools();
  const { subjects, staticSubjects } = useSubjects({ shouldGetStaticSubjects: true, pageSize: 100, shouldGetDistinctSubjects: true });
  const { classes } = useClasses({ shouldGetClasses: true, pageSize: 100, shouldGetAllClassess: true });
  const { weeks } = useWeeks({ shouldGetWeeks: true, pageSize: 100 });
  const { terms } = useTerms({ shouldGetTerms: true, pageSize: 100 });

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
                value={inputs.lessonNote.term}
                onChange={e => handleInput("lessonNote.term", e.target.value)}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Term</option>
                {terms.map((item, key) => (
                  <option value={item.title} key={key}>{item.title}</option>
                ))}
              </select>
              <select
                name="week"
                value={inputs.lessonNote.week}
                onChange={e => handleInput("lessonNote.week", e.target.value)}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Week</option>
                {weeks.map((item, key) => (
                  <option value={item.title} key={key}>{item.title}</option>
                ))}
              </select>
            </div>
            <select
              name="grade"
              value={inputs.lessonNote.grade}
              onChange={e => handleInput("lessonNote.grade", e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              <option value="">Select Grade</option>
              {classes.map((item, key) => (
                <option value={item.student_class} key={key}>{item.student_class}</option>
              ))}
            </select>
            <select
              name="subject"
              value={inputs.lessonNote.subject}
              onChange={e => handleInput("lessonNote.subject", e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              <option value="">Select Subject</option>
              {staticSubjects.map((item, key) => (
                <option value={item.name.split("by")[0]} key={key}>{item.name.split("by")[0]}</option>
              ))}
            </select>
            <input
              type="number"
              name="duration"
              value={inputs.lessonNote.classDuration}
              onChange={e => handleInput("lessonNote.classDuration", e.target.value)}
              placeholder="Class Duration (mins)"
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="topic"
              value={inputs.lessonNote.description}
              onChange={e => handleInput("lessonNote.description", e.target.value)}
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
                  onChange={() => handleFileChange()}
                />
              </label>
            </div>
            <button
              onClick={handleGenerateLessonNote}
              className="w-full bg-[#0598CE] text-white py-2 rounded-lg hover:bg-blue-600"
            >
              {isLoading ? <Loading/> : "Generate"}
            </button>
          </div>
        </div>

        {/* Right Side: Generated Lesson Plan */}
        <div
          className="bg-white p-6 shadow-lg rounded-lg w-full lg:w-2/3"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <GeneratedQuestions 
            onRegenerate={handleGenerateLessonNote} 
            generatedResponse={generatedResponses.lessonNote} 
            isLoading={isLoading}
            title="Lesson note will appear here"
            renderDownloadPDFButton={true}
            pdfDownloadFilename="lesson_note"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonNote;
