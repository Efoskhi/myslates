import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Layout/Header";
import useTeachingTools from "../../../Hooks/useTeachingTools";
import GeneratedQuestions from "../../../components/TeachingTools/GeneratedQuestions";
import Loading from "../../../components/Layout/Loading";

const FeedbackBot = () => {
  const { isLoading, inputs, generatedResponses, handleGenerateFeedback, handleInput } = useTeachingTools();

  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="w-full md:w-1/2 border p-5 rounded-lg shadow bg-white">
          {/* <label className="block text-gray-700 font-semibold mb-2">
            Feedback Type
          </label>
          <select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option>Semantic Feedback</option>
            <option>Grammar Feedback</option>
            <option>Content Feedback</option>
          </select> */}

          <div className="mt-4 border-2 border-dashed border-gray-300 bg-[#f3fbf9] p-6 rounded-lg text-center">
            <label className="cursor-pointer flex flex-col items-center">
              <FaCloudUploadAlt className="text-blue-500 text-4xl mb-2" />
              <input
                id="image_file"
                type="file"
                accept="image/png, image/jpeg, image/svg"
                className="hidden"
                onChange={e => handleInput("feedback.file", e.target.files[0])}
              />
              {inputs.feedback.file ? (
                <p className="text-gray-700">{inputs.feedback.file.name}</p>
              ) : (
                <p className="text-gray-500">
                  Choose a file to upload or drag and drop here <br />
                  (SVG, PNG, JPG - max 800x400px)
                </p>
              )}
            </label>
            
              <button
                type="button"
                className="mt-3 text-[#0598ce] py-1 px-4 rounded-lg"
              >
                <label htmlFor="image_file" className="cursor-pointer">Upload</label>
              </button>
            
          </div>

          <label className="block text-gray-700 font-semibold mt-4 text-xs">
           Write the question below
          </label>
          <textarea
            value={inputs.feedback.description}
            onChange={(e) => handleInput("feedback.description", e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. feedback length"
          ></textarea>

          <button
            disabled={isLoading}
            onClick={handleGenerateFeedback}
            type="submit"
            className="w-full mt-4 bg-[#0598ce] text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {isLoading ? <Loading/> : "Generate"}
          </button>
        </div>

        <div style={{maxHeight:"90vh",overflowY:"auto",overflowX:"hidden"}}>
          <GeneratedQuestions 
            onRegenerate={handleGenerateFeedback} 
            generatedResponse={generatedResponses.feedback} 
            isLoading={isLoading}
            title="Feedback response will appear here"
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackBot;
