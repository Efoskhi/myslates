import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import LessonDetailsModal from "./LessonDetailsModal";
import useLessons from "../../Hooks/useLessons";

const LessonCard = ({ isOwnSubject }) => {
  const hooks = useLessons();
  const {
    isLoading,
    lessons,
    lessonModalVisible,
    handleLessonClick,
    toggleLessonModalVisible,
  } = hooks;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-blue-700 text-lg font-semibold">
          📘 <span>Lessons</span>
        </div>
        {isOwnSubject && (
          <button
            onClick={() => toggleLessonModalVisible("Add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Add Lesson
          </button>
        )}
      </div>

      {lessonModalVisible && (
        <LessonDetailsModal hooks={hooks} isOwnSubject={isOwnSubject} />
      )}
      {!isLoading && lessons.length === 0 && (
        <div className="p-6">
          <p className="text-center text-gray-500">No lesson available.</p>
        </div>
      )}

      {lessons.map((lesson, key) => (
        <div
          key={key}
          className="inline-flex border p-2 mb-4 shadow rounded-md hover:bg-gray-100 items-center w-full justify-between cursor-pointer"
          onClick={() => handleLessonClick(lesson)}
        >
          <div className="flex align-center gap-10">
            <img src={lesson.img_example} className="w-[100px] h-[100px]" />

            <div>
              <p className="text-gray-700">{lesson.id}</p>

              <p
                className="font-semibold overflow-hidden text-ellipsis"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {lesson.content}
              </p>
            </div>
          </div>
          <MdKeyboardArrowRight />
        </div>
      ))}
    </div>
  );
};

export default LessonCard;
