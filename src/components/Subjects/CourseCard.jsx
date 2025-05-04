import { FaBook, FaUsers } from "react-icons/fa";
import Course from "../../assets/Course.png";
import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import ConfirmDuplicateSubjectModal from "./ConfirmDuplicateSubjectModal";
import React from "react";

export const CourseCard = ({ subject, isOwnSubject, handleDuplicateSubject, isSaving, handleDuplicateSubjectCallback }) => {
  const [ isVisibleModal, setVisibleModal ] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem("subject", JSON.stringify({ ...subject, isOwnSubject }));
    navigate("/SubjectDetails"); // Update the route as needed
  };

  const toggleModal = () => setVisibleModal(prev => !prev);

  const handleAddSubject = (e) => {
    e.stopPropagation();
    toggleModal()
  }

  // Destructure subject data; adjust property names based on your data
  const { classRef, title, thumbnail } = subject;

  return (
    <>
      {isVisibleModal && 
        <ConfirmDuplicateSubjectModal 
          isSaving={isSaving}
          handleDuplicateSubject={handleDuplicateSubject}
          toggleModal={toggleModal}
          subject={subject}
          callback={handleDuplicateSubjectCallback}
        />
      }
      <div
        className="rounded-md shadow-md overflow-hidden w-full cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={thumbnail || Course} // Use provided thumbnail or fallback image
          alt="Course Thumbnail"
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <p className="text-sm text-gray-500">{classRef.student_class}</p>
          <h2 className="text-lg font-bold">{title}</h2>
          {!isOwnSubject && 
            <button onClick={handleAddSubject} class="flex items-center gap-1 bg-blue-600 my-2 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200">
              <CiCirclePlus className="text-xl" /> Add
            </button>
          }
          
          {/* <div className="flex items-center text-gray-600 text-sm mt-2">
            <FaBook className="mr-1 text-[#0598ce]" /> {lessons} Lessons
            <span className="mx-2">|</span>
            <FaUsers className="mr-1 text-[#0598ce]" /> {studentsCount} Students
          </div> */}
        </div>
      </div>
    </>
  );
};
