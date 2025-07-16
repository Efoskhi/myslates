import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useResultManagement from "../../../Hooks/useResultManagement";

const ResultManagement = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This navigates back to the previos page
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("SS 1");


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
    // Navigate to result upload page with selected class
    navigate(`/UploadResult`);
    setShowModal(false);
  };

  const { isLoading, students, pagination, subject } = useResultManagement({});

  const classes = [subject.classRef.student_class];

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
              <h2 className="text-center text-lg font-medium mb-6">
                Select Class
              </h2>

              {/* Class selection options */}
              <div className="space-y-2">
                {classes.map((classItem) => (
                  <div
                    key={classItem}
                    className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                      selectedClass === classItem
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleClassSelect(classItem)}
                  >
                    <span>{classItem}</span>
                    {selectedClass === classItem ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Continue button */}
              <button
                className="w-full bg-blue-500 text-white p-3 rounded-md mt-6 font-medium"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <h1 className="font-bold text-xl">List of { subject.title } Students</h1>

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
                {students.map((student) => (
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
                    <td className="px-4 py-3 text-sm">{student.display_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.phone_number}
                    </td>
                    <td className="px-4 py-3 text-sm">{student.student_class}</td>
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

export default ResultManagement;
