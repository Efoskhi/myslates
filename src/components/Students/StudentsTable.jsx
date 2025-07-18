import React, { useState,useEffect,useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
import Face2 from "../../assets/Face2.png";
import { IoFilter } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { docQr } from './../../Logics/docQr_ORGate';
import {ClipLoader} from "react-spinner";
import useStudents from "../../Hooks/useStudents";
import Pagination from "../Layout/Pagination";

const SubjectTag = ({ subject }) => {
  const getTagColor = (subject) => {
    const colors = {
      English: "bg-blue-50 text-blue-600",
      Biology: "bg-green-50 text-green-600",
      "Basic Science": "bg-purple-50 text-purple-600",
      Chemistry: "bg-pink-50 text-pink-600",
      Physics: "bg-orange-50 text-orange-600",
    };
    return colors[subject] || "bg-gray-50 text-gray-600";
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(
        subject
      )}`}
    >
      {subject}
    </span>
  );
};

const StudentsTable = () => {
  const navigate = useNavigate();

  const handleClick = (student) => {
    sessionStorage.setItem("student", JSON.stringify(student));
    navigate("/StudentDetails"); // Update the route as needed
  };

  const { loading, students, pagination, handlePaginate } = useStudents({shouldGetStudentSubjects: true, shouldStoreCache: false});

  const STUDENTS_DATA=useMemo(() => students.map((e)=>{
    return {
      ...e,
    }
  }), [students])

  return (
    <div className="bg-[#fcfeff] mx-auto p-6">
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#101828]">
            List of Students
          </h2>
          {/* <button className="inline-flex items-center px-3 py-1.5 text-sm text-gray-800 border rounded-lg hover:bg-gray-50">
            <IoFilter className="w-4 h-4 mr-2" />
            Apply filter
          </button> */}
        </div>
{loading && <span>Loading...</span> }
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50/50">
                <th className="w-6 px-4 py-3">
                  <input type="checkbox" className="rounded text-blue-500" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Grade Level
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Subjects
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {STUDENTS_DATA.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={()=>handleClick(student)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded text-blue-500 hidden"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={student.photo_url}
                        alt={student.display_name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {student.display_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {student.phone_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {student.grade}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {student?.subjects?.map((subject, index) => (
                        <SubjectTag key={index} subject={subject.title.split("by")[0]} />
                      ))}
                      {student?.additionalScore && (
                        <span className="text-xs text-gray-500">
                          {student.additionalScore}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length > 0 && 
          <Pagination
            onPageChange={handlePaginate}
            page={pagination.page}
            totalPages={pagination.totalPages} 
          />
        }
      </div>
    </div>
  );
};

export default StudentsTable;
