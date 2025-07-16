import React, { useEffect, useState } from "react";
import Header from "../../../components/Layout/Header";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useResultManagement from "../../../Hooks/useTermlyResult";
import useStudents from "../../../Hooks/useStudents";

const TermlyResult = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This navigates back to the previos page
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  const [selectedSession, setSelectedSession] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedTerm, setSelectedTerm] = useState();
  const [selectedStudent, setSelectedStudent] = useState();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [schoolId, setSchoolId] = useState();
  const [studentId, setStudentId] = useState();
  const session = ["2025/2026", "2024/2025", "2023/2024"];
  const terms = ["First Term", "Second Term", "Third Term"];
  const categories = [
    "Nursery",
    "Primary",
    "Junior Secondary",
    "Senior Secondary",
  ];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleContinue = () => {

    navigate(
      `/UploadResult2?${new URLSearchParams({
        className: selectedClass,
        term: selectedTerm,
        session: selectedSession,
        studentLength: students.length,
        studentId,
        schoolId
      }).toString()}` 
    );
    setShowModal(false);
  };

  const {
    isLoading,
    getStudents,
    pagination,
    subject,
    classes,
    getClassesAndCategories,
  } = useResultManagement({});

  useEffect(() => {
    getClassesAndCategories();
  }, [getClassesAndCategories]);
  useEffect(() => {
    if (selectedClass) {
      getStudents(selectedClass).then((data) => {
        setStudents(data);
      });
    } else {
    }
  }, [selectedClass, getStudents]);
  useEffect(() => {
    getStudents(null, true).then((data) => {
      setAllStudents(data);
    });
  }, [getStudents]);
  return (
    <div>
      <Header />
      <div className="  p-6 bg-white ">
        <div className="flex flex-row items-center justify-between pb-4">
          <div
            className="border p-1 px-2 text-xs rounded-md inline-flex items-center cursor-pointer hover:bg-gray-100"
            onClick={handleBack}
          >
            <IoIosArrowBack /> Back
          </div>
          <div
            className="border  text-xs rounded-md cursor-pointer bg-[#047aa5] text-white p-3 px-6"
            onClick={handleOpenModal}
          >
            Upload Result
          </div>
        </div>

        {/* Modal overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            {/* Modal content */}
            <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 mx-4">
              <h2 className="text-center uppercase text-lg font-medium">
                Result Management System
              </h2>
              <p className="text-center text-sm text-gray-600 mb-4">
                Fill the following information to generate result
              </p>
              <form className="">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                  >
                    <option value="">Select Session</option>
                    {session.map((sess, index) => (
                      <option key={index} value={sess}>
                        {sess}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                  >
                    <option value="">Select Term</option>
                    {terms.map((term, index) => (
                      <option key={index} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClass}
                    onChange={(e) => handleClassSelect(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {classes.map((classItem, index) => (
                      <option key={index} value={classItem.student_class}>
                        {classItem.student_class}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={studentId || ""}
                    onChange={(e) => {
                      const selectedUid = e.target.value;
                      setStudentId(selectedUid);
                      const selectedStudent = students.find(
                        (student) => student.uid === selectedUid
                      );
                      setSchoolId(selectedStudent?.school_id);
                      setSelectedStudent(selectedStudent.display_name);
                    }}
                  >
                    <option>Select Student</option>
                    {students.map((student, index) => (
                      <option  key={index} value={student.uid}>
                        {student.display_name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>

              {/* Continue button */}
              <button
                className="w-full bg-blue-500 text-white p-3 rounded-md mt-6 font-medium"
                onClick={handleContinue}
                disabled={
                  !selectedSession ||
                  !selectedCategory ||
                  !selectedTerm ||
                  !selectedClass ||
                  !studentId
                }
              >
                Continue 
              </button>
            </div>
          </div>
        )}

        <div className=" mx-auto ">
          <div className=" border border-sky-100 rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-600 bg-sky-50">
                  <th className="w-12"></th>
                  <th className="text-left py-3 px-4 font-medium">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Phone Number
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Grade Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((student) => (
                  <tr key={student.id} className="border-t border-sky-100">
                    <td className="pl-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                        <img
                          src={student.photo_url}
                          alt={student.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.display_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.phone_number}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {student.student_class}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermlyResult;
