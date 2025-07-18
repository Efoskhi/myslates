import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useStudentResults from "../../../Hooks/useStudentResults";
import Loading from "../../../components/Layout/Loading";

export default function StudentResult() {
  // Sample student data


  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This navigates back to the previous page
  };

  const student = JSON.parse(sessionStorage.getItem('student') ?? "null");
  const user = JSON.parse(sessionStorage.getItem('user') ?? "null");

  const { isLoading, isSaving, inputs, studentResults, handleInput, submitToAdmin } = useStudentResults();

  return (
    <div className=" mx-auto p-4">
      <div className="flex flex-row items-center justify-between pb-4">
        <div
          className="border p-1 px-2 text-xs rounded-md inline-flex items-center cursor-pointer hover:bg-gray-100"
          onClick={handleBack}
        >
          <IoIosArrowBack /> Back
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Student Header */}
        <div className="p-6 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-sky-100 rounded-full p-1">
              <img
                src={student.photo_url}
                alt={student.display_name}
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {student.display_name}
              </h2>
              <p className="text-sm text-gray-500">{student.id}</p>
              <p className="text-sm text-gray-500">{student.student_class}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-sm text-gray-500">Term Ending</p>
              <p className="text-sm font-medium">{student.termEnding ?? ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Term/Session</p>
              <p className="text-sm font-medium">{student.termSession ?? ""}</p>
            </div>
          </div>
        </div>

        {/* Student Result Summary */}
        <div className="p-0 border-t border-gray-200">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-6 text-sm">Final Grade</td>
                <td className="py-3 px-6 text-sm text-right font-medium">
                  {student.finalGrade ?? ""}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-6 text-sm">Total Score</td>
                <td className="py-3 px-6 text-right relative">
                  <span className="text-sm font-medium">
                    {studentResults.totalScore}
                  </span>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <div className="bg-pink-400 text-white text-xs px-2 py-0.5 rounded">
                      Top Student
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-6 text-sm">Final Average</td>
                <td className="py-3 px-6 text-sm text-right font-medium">
                  {student.finalAverage ?? ""}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-6 text-sm">Number in Class</td>
                <td className="py-3 px-6 text-sm text-right font-medium">
                  {studentResults.number_in_class}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 text-sm">Position in class</td>
                <td className="py-3 px-6 text-right">
                  <div className="inline-flex items-center border border-gray-300 rounded-md px-2 py-1">
                    <span className="text-sm text-blue-500 font-medium">
                      {student.positionInClass ?? ""}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Subject Results Table */}
        <div className="mt-2 overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#0598ce] text-white">
                <th className="py-2 px-4 text-left text-sm font-medium">
                  Subjects
                </th>
                <th className="py-2 px-4 text-center text-sm font-medium">
                  CA 1 (20)
                </th>
                <th className="py-2 px-4 text-center text-sm font-medium">
                  CA 2 (20)
                </th>
                <th className="py-2 px-4 text-center text-sm font-medium">
                  Exams (60)
                </th>
                <th className="py-2 px-4 text-center text-sm font-medium">
                  Total Scores
                </th>
                <th className="py-2 px-4 text-center text-sm font-medium">
                  Grades
                </th>
                <th className="py-2 px-4 text-center text-sm font-medium">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && 
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><Loading/></td>
                  <td></td>
                  <td></td>
                </tr>
              }
              {studentResults.ResultSubjects?.map((subject, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm">{subject.subject_name.split("by")[0]}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    {subject.first_ca}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {subject.second_ca}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {subject.exam}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {subject.total}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {subject.grade}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {subject.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {studentResults.result_status === "Pending" && 
          <form className="py-12 px-6">
            <div className="mb-6">
              <label
                htmlFor="teacherName"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Class Teacher's Name
              </label>
              <input
                type="text"
                id="teacherName"
                placeholder="e.g Mrs Adewuyi Bella"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={user.display_name}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="teacherRemark"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Class Teacher Remark
              </label>
              <textarea
                id="teacherRemark"
                rows={4}
                placeholder="e.g alaroloye@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputs.class_teacher_comment}
                onChange={e => handleInput("class_teacher_comment", e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={submitToAdmin}
                type="submit"
                className="bg-[#0598ce] hover:bg-blue-600 text-white py-3 px-12 rounded-md w-full md:w-auto md:min-w-48 text-center"
              >
                {isSaving ? <Loading/> : "Submit to Admin" }
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
}
