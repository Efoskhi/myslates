import Header from "../../../components/Layout/Header";
import Course from "../../../assets/Course.png";
import { IoCopyOutline } from "react-icons/io5";
import ClassDetailsAccordion from "../../../components/Subjects/ClassDetailsAccordion";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React from "react";
import SubjectDeleteModal from "../../../components/Subjects/SubjectDeleteModal";
import { useAppContext } from "../../../context/AppContext";


const SubjectDetails = () => {
  const [ isVisibleDeleteModal, setVisibleDeleteModal ] = React.useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This navigates back to the previous page
  };

  const goToStudentsList = () => {
    navigate("/ResultManagement"); // Navigate to the ResultManagement page
  };

  const { currentSubject: subject } = useAppContext();

  const toggleDeleteVisibleModal = () => setVisibleDeleteModal(prev => !prev);

  // If no subject data exists, render a fallback message
  if (!subject) {
    return (
      <div>
        <Header />
        <div className="p-6">
          <p className="text-center text-gray-500">No subject data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {isVisibleDeleteModal && <SubjectDeleteModal toggleModal={toggleDeleteVisibleModal} /> }
      <div className="p-6 bg-white">
        {subject.isOwnSubject && 
          <>
            <div className="flex flex-row items-center justify-between pb-4">
              <div
                className="border p-1 px-2 text-xs rounded-md inline-flex items-center cursor-pointer hover:bg-gray-100"
                onClick={handleBack}
              >
                <IoIosArrowBack /> Back
              </div>
              <div
                className="border p-1 px-2 text-xs rounded-md cursor-pointer hover:bg-gray-100"
                onClick={goToStudentsList}
              >
                View Students List
              </div>
            </div>
            {/* Render subject title or fallback */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{subject.title || "Subject Title"}</h1>
              <button
                onClick={toggleDeleteVisibleModal}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete Subject
              </button>
            </div>
          </>
        }

        <div className="mt-2">
          {/* <p className="text-gray-500">Class Link</p> */}
          <div className="inline-flex justify-between w-full">
            {/* Render subject class link or fallback */}
            <a href="#" className="font-semibold text-blue-500">
              {/* {subject.classLink || "ACL-A1SBU"} */}
            </a>
            {/* <IoCopyOutline className="text-gray-500" /> */}
          </div>
        </div>

        <div className="mt-4 gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
            {/* Render subject thumbnail image or fallback image */}
            <img
              src={subject.thumbnail || Course}
              alt="Class Thumbnail"
              className="w-full h-60 rounded-lg object-cover"
            />
            <div className="absolute bottom-4 left-3 text-gray-200">
              {/* Render subject grade or fallback */}
              <p className="text-sm">{subject.classRef.student_class || ""}</p>
              {/* Render subject title again or fallback */}
              <h2 className="text-xl font-bold">{subject.title || "Economics"}</h2>
            </div>
          </div>

          <div className="w-full">
            {/* Render subject description or fallback text */}
            <p className="mt-2 text-gray-700 text-base">
              {subject.description ||
                "The course introduces a full review of the subject. This is the subject description that shows a class overview so the teacher has a view of the class."}
            </p>
            <div className="flex items-center text-gray-600 text-sm mt-3">
              {/* Render number of lessons or fallback */}
              <p className="text-[#035B7c] font-bold">
                {/* {subject.Lessons ? subject.Lessons.length + " LESSONS" : ""} */}
              </p>
              {/* <span className="mx-2">|</span> */}
              {/* Render student count or fallback */}
              <p className="text-[#035B7c] font-bold">
                {subject.studentsCount ? subject.studentsCount + " STUDENTS" : ""}
              </p>
            </div>
          </div>
        </div>

        <ClassDetailsAccordion isOwnSubject={subject.isOwnSubject}/>
      </div>
    </div>
  );
};

export default SubjectDetails;
