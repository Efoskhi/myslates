import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import UpdateTopicDetails from "../../../components/Subjects/TopicDetails";
import LessonCard from "../../../components/Subjects/LessonCard";
import QuizCard from "../../../components/Subjects/QuizCard";
import AssignmentCard from "../../../components/Subjects/AssignmentCard";

const tabClasses = (active) =>
  `px-4 py-2 rounded-t-md font-medium transition ${
    active
      ? "bg-blue-600 text-white"
      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
  }`;

const TopicDetails = () => {
  const [activeTab, setActiveTab] = useState("details");

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const topic = JSON.parse(sessionStorage.getItem("currentTopic") || "null");

  if (!topic) {
    return (
      <div>
        <Header />
        <div className="p-6">
          <p className="text-center text-gray-500">No topic data available.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="p-4">
            <div className="flex items-center gap-2 text-blue-700 text-lg font-semibold">
              📋 <span>Topic details</span>
            </div>
            <UpdateTopicDetails section="Update" />
          </div>
        );
      case "lessons":
        return (
          <div className="p-4">
            <LessonCard />
          </div>
        );
      case "quizzes":
        return (
          <div className="p-4">
            <QuizCard />
          </div>
        );
      case "assignment":
        return (
          <div className="p-4">
            <AssignmentCard />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto mt-8">
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-blue-200">
          <button
            className={tabClasses(activeTab === "details")}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={tabClasses(activeTab === "lessons")}
            onClick={() => setActiveTab("lessons")}
          >
            Lessons
          </button>
          <button
            className={tabClasses(activeTab === "quizzes")}
            onClick={() => setActiveTab("quizzes")}
          >
            Quizzes
          </button>
          <button
            className={tabClasses(activeTab === "assignment")}
            onClick={() => setActiveTab("assignment")}
          >
            Assignment
          </button>
          <button
            onClick={openModal}
            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-t-md font-medium transition "
          >
            Start Teaching
          </button>
          {/* Modal Overlay */}
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              {/* Modal Content */}
              <div className="bg-white rounded-lg h-screen w-full lg:max-w-7xl p-6 relative overflow-y-auto">
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                  onClick={closeModal}
                >
                  &times;
                </button>

                {/* Modal Body */}
                <div className="bg-cyan-500 text-white px-4 py-2  rounded-md mb-4 font-semibold ">
                  Lesson 1
                  <div className="text-sm font-normal">
                    Topic 1: Parts of the Mouth – The Teeth
                  </div>
                </div>
                {/* Note */}
                <div className="bg-cyan-50 border border-cyan-200 p-4  rounded-md space-y-4">
                  <div className="text-cyan-700 font-semibold">Note:</div>
                  {/* You can replace this image with a local import if you want */}
                  <img
                    src="https://i.imgur.com/Z5pN3pP.png"
                    alt="Parts of the Mouth"
                    className="mx-auto w-48"
                  />
                  <p className="text-gray-800 text-sm">
                    Teeth are hard structures in the mouth that help us chew
                    food. Humans have different types of teeth, and each one has
                    a specific function. The four main types of teeth are
                    incisors, canines, premolars, and molars. These teeth work
                    together to help us bite, tear, crush, and grind food
                    properly before swallowing.
                  </p>
                </div>

                {/* Watch Video Link */}
                <div className="flex justify-end mt-2 pb-52">
                  <button className="text-cyan-600 text-sm hover:underline flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 8.64v6.72L15.27 12 10 8.64z" />
                      <path d="M24 0v24H0V0h24z" fill="none" />
                    </svg>
                    Watch Video
                  </button>
                </div>

                {/* Examples */}
                <div className="bg-red-50 border border-red-400 p-4 rounded-md space-y-4">
                  <div className="text-red-700 font-semibold">Examples:</div>
                  {/* You can replace this image with a local import if you want */}
                  <img
                    src="https://i.imgur.com/Z5pN3pP.png"
                    alt="Parts of the Mouth"
                    className="mx-auto w-48"
                  />
                  <p className="text-gray-800 text-sm">1. Chewing rice</p>
                </div>

                {/* Watch Video Link */}
                <div className="flex justify-end mt-2 pb-12">
                  <button className="text-red-600 text-sm hover:underline flex items-center">
                    Simplify
                  </button>
                </div>
                <div className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 mx-auto text-center py-4 text-white rounded-md ">
                  Continue
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white border border-t-0 border-blue-200 shadow-md rounded-b-md">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TopicDetails;
