import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import UpdateTopicDetails from "../../../components/Subjects/TopicDetails";
import LessonCard from "../../../components/Subjects/LessonCard";
import QuizCard from "../../../components/Subjects/QuizCard";
import AssignmentCard from "../../../components/Subjects/AssignmentCard";
import StartTeaching from "../../../components/Subjects/StartTeaching";
import LessonPlan from "../../../components/Subjects/LessonPlan";
import { useAppContext } from "../../../context/AppContext";

const tabClasses = (active) =>
  `lg:px-4 px-2 py-2 rounded-t-md lg:text-base text-[10px] font-medium transition ${
    active
      ? "bg-blue-600 text-white lg:text-base text-[10px]"
      : "bg-blue-100 text-blue-600 hover:bg-blue-200 lg:text-base text-[10px]"
  }`;

const TopicDetails = () => {
  const [activeTab, setActiveTab] = useState("details");

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLessonPlan, setIsOpenLessonPlan] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openLessonPlanModal = () => setIsOpenLessonPlan(true);
  const closeLessonPlanModal = () => setIsOpenLessonPlan(false);

  const { currentTopic: topic } = useAppContext();

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

  const isOwnSubject = topic.isOwnSubject;

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
            <LessonCard isOwnSubject={isOwnSubject} />
          </div>
        );
      case "quizzes":
        return (
          <div className="p-4">
            <QuizCard isOwnSubject={isOwnSubject} />
          </div>
        );
      case "assignment":
        return (
          <div className="p-4">
            <AssignmentCard isOwnSubject={isOwnSubject} />
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
            className="bg-blue-100  text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-t-md font-medium transition lg:text-base text-[10px] "
          >
            Start Teaching
          </button>
          {isOpen && <StartTeaching closeModal={closeModal} />}
          <button
            onClick={openLessonPlanModal}
            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-t-md font-medium transition lg:text-base text-[10px]"
          >
            View Lesson Plan
          </button>
          {isOpenLessonPlan && <LessonPlan closeModal={closeLessonPlanModal} />}
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
