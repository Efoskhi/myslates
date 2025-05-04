import React, { useState } from "react";
import useTopicDetails from "../../Hooks/useTopicDetails";
import Header from "../Layout/Header";
import Loading from "../Layout/Loading";
import { IoClose } from "react-icons/io5";

const TopicDetails = ({ section, handleCloseModal }) => {
    const topic = section === "Update" ? JSON.parse(sessionStorage.getItem("currentTopic") || "null") : null;

    if (!topic && section === "Update") {
        return (
            <div>
                <Header />
                <div className="p-6">
                    <p className="text-center text-gray-500">
                        No topic data available.
                    </p>
                </div>
            </div>
        );
    }

    const { 
        weeks, 
        terms, 
        inputs, 
        isSaving,
        handleInput, 
        handleUpdateTopic,
        handleAddTopic 
    } = useTopicDetails(topic);

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border border-blue-100">
            <div className="flex justify-between items-center border-b pb-3 ">
                {(topic.isOwnSubject || section === "Add") && 
                    <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                        {section} Topic
                    </h2>
                }
                {section === "Add" && 
                    <button onClick={handleCloseModal}>
                        <IoClose className="text-xl text-gray-500 hover:text-gray-700" />
                    </button>
                }
            </div>

            {/* Week Select */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Week
                </label>
                <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={inputs.week}
                    onChange={(e) => handleInput("week", e.target.value)}
                >
                    <option value="">Select Week</option>
                    {weeks.map((week, key) => (
                        <option key={key} value={week.title}>
                            {week.title}
                        </option>
                    ))}
                    {/* Add more weeks as needed */}
                </select>
            </div>

            {/* Term Select */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                </label>
                <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={inputs.term}
                    onChange={(e) => handleInput("term", e.target.value)}
                >
                    <option value="">Select Term</option>
                    {terms.map((term, key) => (
                        <option key={key} value={term.title}>
                            {term.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Title Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic Name
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter topic title"
                    value={inputs.title}
                    onChange={(e) => handleInput("title", e.target.value)}
                />
            </div>

            {/* Title Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ensure serial number does not exist already"
                    value={inputs.serial_no}
                    onChange={(e) => handleInput("serial_no", e.target.value)}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Plan
                </label>
                <textarea
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                    value={inputs.lesson_plan}
                    onChange={(e) => handleInput("lesson_plan", e.target.value)}
                />
            </div>

            {/* Update Button */}
            {(topic.isOwnSubject || section === "Add") && 
                <button
                    onClick={section === "Update" ? handleUpdateTopic : () => handleAddTopic()}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
                >
                    {isSaving ? <Loading/> : `${section} Topic`}
                </button>
            }
        </div>
    );
};

export default TopicDetails;
