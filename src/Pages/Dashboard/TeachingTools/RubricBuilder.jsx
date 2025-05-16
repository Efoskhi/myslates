import  React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import GeneratedQuestions from "../../../components/TeachingTools/GeneratedQuestions";
import useTeachingTools from "../../../Hooks/useTeachingTools";
import useSubjects from "../../../Hooks/useSubject";
import useClasses from "../../../Hooks/useClasses";
import Loading from "../../../components/Layout/Loading";

const RubricBuilder = () => {
  const { inputs, isLoading, generatedResponses, handleInput, handleGenerateRubricBuilder } = useTeachingTools();
  const { subjects, staticSubjects } = useSubjects({ shouldGetStaticSubjects: true, pageSize: 100, shouldGetDistinctSubjects: true });
  const { classes, isLoading: isLoadingClasses } = useClasses({ shouldGetClasses: true, pageSize: 100, shouldGetAllClassess: true });

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-blue-100 p-6">
        <div className="max-w-5xl w-full bg-white shadow-lg p-6 rounded-lg grid grid-rows-2 gap-6">
          {/* Left Panel - Form */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Rubric Builder Prompt</h2>
            <div className="space-y-4">
              {/* Question Type */}
              <div>
                <label className="text-xs">Question Type</label>
                <select
                  name="questionType"
                  value={inputs.rubricBuilder.questionType}
                  onChange={e => handleInput("rubricBuilder.questionType", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Option</option>
                  <option value="Fill in the blanks">Fill in the Blanks</option>
                  <option value="Multiple choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Essay">Essay</option>
                  <option value="Short Answer">Short Answer</option>
                </select>
              </div>
              {/* Grade */}
              <div>
                <label className="text-xs">Grade</label>
                <select
                  name="grade"
                  value={inputs.rubricBuilder.grade}
                  onChange={e => handleInput("rubricBuilder.grade", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Grade</option>
                  {classes.map((item, key) => (
                    <option value={item.student_class} key={key}>{item.student_class}</option>
                  ))}
                </select>
              </div>
              {/* Subject */}
      
              {/* Question Type & No of Questions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs">Subject</label>
                  <select
                    name="subject"
                    value={inputs.rubricBuilder.subject}
                    onChange={e => handleInput("rubricBuilder.subject", e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Subject</option>
                    {staticSubjects.map((item, key) => (
                      <option value={item.name.split("by")[0]} key={key}>{item.name.split("by")[0]}</option>
                    ))}
                  </select>
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-xs">Question Type</label>
                  <select
                    name="questionType"
                    value={inputs.rubricBuilder.questionType}
                    onChange={e => handleInput("rubricBuilder.questionType", e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option>Multiple Choice</option>
                    <option>Fill in the Blanks</option>
                    <option>True/False</option>
                  </select>
                </div> */}
                <div className="flex flex-col">
                  <label className="text-xs">Total Points</label>
                  <input
                    type="number"
                    name="totalPoints"
                    min="1"
                    max="20"
                    value={inputs.rubricBuilder.totalPoints}
                    onChange={e => handleInput("rubricBuilder.totalPoints", e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              {/* Topic */}
              <div>
                <label className="text-xs">Question</label>
                <input
                  type="text"
                  name="topic"
                  value={inputs.rubricBuilder.question}
                  placeholder="Enter question"
                  onChange={e => handleInput("rubricBuilder.question", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* File Upload */}
              {/* <div className="border bg-[#f3fbf9] rounded-lg flex items-center p-4 justify-between">
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
                        onChange={e => handleInput("rubricBuilder.file", e.target.files[0])}
                      />
                      <p>Tap to Upload</p>
                    </label>
                    <p className="text-gray-600">JPEG,PNG,SVG | 10MB max.</p>
                  </div>
                </div>
                <div className="text-sm text-white py-2 px-4 rounded-md bg-[#0598ce] cursor-pointer">
                  Upload
                </div>
              </div> */}
              {inputs.rubricBuilder.file && (
                <p className="text-sm mt-2">{inputs.rubricBuilder.file.name}</p>
              )}
              {/* Generate Button */}
              <button
                disabled={isLoading}
                onClick={handleGenerateRubricBuilder}
                className="w-full p-3 bg-[#0598ce] text-white rounded hover:bg-blue-600"
              >
                {isLoading ? <Loading/> : "Generate"}
              </button>
            </div>
          </div>

          {/* Right Panel - Generated Questions */}
          <div style={{maxHeight:"90vh",overflowY:"auto",overflowX:"hidden"}}>
            <GeneratedQuestions 
              onRegenerate={handleGenerateRubricBuilder} 
              generatedResponse={generatedResponses.rubricBuilder} 
              isLoading={isLoading}
              title="Rubric questions will appear here"
              renderDownloadPDFButton={true}
              pdfDownloadFilename="rubric_builder"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RubricBuilder;
