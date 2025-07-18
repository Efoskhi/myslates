import React, { useState } from "react";
import Header from "../../../components/Layout/Header";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useResultManagement from "../../../Hooks/useResultManagement";
import toast from "react-hot-toast";
import Loading from "../../../components/Layout/Loading";

export default function UploadResult() {
  
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This navigates back to the previous page
  };

  const { 
    students: allStudents,
    studentResults,
    isSaving,
    handleAddResults,
    handleStudentResultInputChange,
    addMoreStudentResult,
   } = useResultManagement({ shouldGetPrefetchedStudents: true })

  return (
    <div>
      <Header />

      <div className=" mx-auto p-6 bg-white">
        <div
          className="border p-1 px-2 text-xs rounded-md inline-flex items-center cursor-pointer hover:bg-gray-100"
          onClick={handleBack}
        >
          <IoIosArrowBack /> Back
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 pt-5">
            Student Result System
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kindly fill the form below carefully and preview what you filled
            before you submit.
          </p>
        </div>

        <div className="space-y-4">
          {studentResults.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-12 gap-4 items-start"
            >
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select student
                </label>
                <div className="relative">
                  <select
                    className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={student.student}
                    onChange={(e) =>
                      handleStudentResultInputChange(student.id, "student", e.target.value)
                    }
                  >
                    <option value="">Select option</option>
                    {allStudents.map((item, key) => (
                      <option value={JSON.stringify(item)} key={key}>{item.display_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA 1
                </label>
                <input
                  type="text"
                  placeholder="e.g 10"
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={student.ca1}
                  onChange={(e) =>
                    handleStudentResultInputChange(student.id, "ca1", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CA 2
                </label>
                <input
                  type="text"
                  placeholder="e.g 20"
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={student.ca2}
                  onChange={(e) =>
                    handleStudentResultInputChange(student.id, "ca2", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam
                </label>
                <input
                  type="text"
                  placeholder="e.g 70"
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={student.exam}
                  onChange={(e) =>
                    handleStudentResultInputChange(student.id, "exam", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. B+"
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={student.remarks}
                  onChange={(e) =>
                    handleStudentResultInputChange(student.id, "remarks", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            className="inline-flex items-center px-4 py-2 bg-[#0598ce] text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={addMoreStudentResult}
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add more
          </button>
        </div>

        <div className="mt-8 items-end flex-col flex w-full">
          <button onClick={handleAddResults} className="px-20 mt-[20vh] py-2 bg-[#0598ce] text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {isSaving ? <Loading/> : "Submit Results"}
          </button>
        </div>
      </div>
    </div>
  );
}
