import React, { useEffect, useState } from "react";
import Header from "../../../components/Layout/Header";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useResultManagement from "../../../Hooks/useTermlyResult";
import toast from "react-hot-toast";
import Loading from "../../../components/Layout/Loading";

export default function UploadResult2() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const queryParams = new URLSearchParams(window.location.search);
  const classId = queryParams.get("className");
  const term = queryParams.get("term");
  const session = queryParams.get("session");
  const studentId = queryParams.get("studentId");
  const studentLength = queryParams.get("studentLength");
  const schoolId = queryParams.get("schoolId");
  const [studentResults, setStudentResults] = useState([{}]);
  const [classTeacherComment, setClassTeacherComment] = useState("");
  const [loading, setLoading] = useState(false);
  const handleBack = () => {
    navigate(-1); // This navigates back to the previous page
  };

  const addMoreStudent = () => {
    setStudentResults((value) => [...value, {}]);
  };
  const handleChange = (id, field, value) => {
    setStudentResults((prev) => {
      const val = [...prev];
      val[id][field] = value;
      return val;
    });
  };
  const { getSubjectsList, handleAddStudentResults } = useResultManagement({});
  useEffect(() => {
    if (
      !classId ||
      !studentId ||
      !session ||
      !schoolId ||
      !studentLength ||
      !term
    )
      navigate(-1);

    getSubjectsList(schoolId).then((data) => {
      setSubjects(data.Subjects.map((subject) => subject.title));
    });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    toast.success("lol")
    handleAddStudentResults({
      classTeacherComment,
      className: classId,
      term,
      selectedSession: session,
      studentId,
      studentLength,
      result: studentResults.map(({ ca1, ca2, subject, exam, remark }) => ({
        ca1,
        ca2,
        exam,
        subjectName: subject,
        remark
      })),
    });
  };
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
          {studentResults.map((student, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subject
                </label>
                <div className="relative">
                  <select
                    className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={studentResults?.[index]?.["subject"]}
                    onChange={(e) =>
                      handleChange(index, "subject", e.target.value)
                    }
                  >
                    <option value="">Select subject</option>
                    {subjects.map((item, key) => (
                      <option value={item} key={key}>
                        {item}
                      </option>
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
                  value={studentResults?.[index]?.["ca1"]}
                  onChange={(e) => handleChange(index, "ca1", e.target.value)}
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
                  value={studentResults?.[index]?.["ca2"]}
                  onChange={(e) => handleChange(index, "ca2", e.target.value)}
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
                  value={studentResults?.[index]?.["exam"]}
                  onChange={(e) => handleChange(index, "exam", e.target.value)}
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
                  value={studentResults?.[index]?.["remark"]}
                  onChange={(e) =>
                    handleChange(index, "remark", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            className="inline-flex items-center px-4 py-2 bg-[#0598ce] text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={addMoreStudent}
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
        <div className="mt-6">
          <p className="text-md font-semibold">Comments</p>
          <p className="text-sm">
            Kindly enter your comments and submit result
          </p>
          <div className="col-span-2 mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class teacher's comment
            </label>
            <textarea
              type="text"
              value={classTeacherComment}
              onChange={(e) => setClassTeacherComment(e.target.value)}
              placeholder="Enter your comment here"
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-8 items-end flex-col flex w-full">
          <button
            onClick={handleSubmit}
            disabled={
              classTeacherComment?.trim()?.length < 1 &&
              !studentResults.every(
                (student) =>
                  student.subject &&
                  student.ca1 &&
                  student.ca2 &&
                  student.exam &&
                  student.remarks
              )
            }
            className="px-20 mt-[20vh] py-2 bg-[#0598ce] text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? <Loading /> : "Submit Results"}
          </button>
        </div>
      </div>
    </div>
  );
}
