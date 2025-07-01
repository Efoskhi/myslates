import React from "react";
import { useNavigate } from "react-router-dom";
import useAssignments from "../../../Hooks/useAssignment";
import Loading from "../../../components/Layout/Loading";
import { formatFirestoreTimestamp } from "../../../utils";

const Assignments = () => {
  const navigate = useNavigate();

  const { subjectAssignments, isLoading } = useAssignments({ shouldGetSubjectAssignment: true, shouldGetAssignment: false });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shadow-md bg-white">
        <button className="text-2xl" onClick={() => navigate(-1) }>←</button>
        <h1 className="text-xl font-semibold text-cyan-500">Assignment</h1>
        <div className="w-6" /> {/* Spacer to balance back arrow */}
      </div>

      {/* Assignment List */}
      {isLoading && <Loading/>}
      <div className="p-4">
        {subjectAssignments.map((item, key) => (
          <div className="flex items-start space-x-4 border-b pb-4" key={key} onClick={() => navigate(`/subject/assignmentrecords/${item.id}`)}>
            <div className="bg-cyan-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-cyan-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M12 20l9-5-9-5-9 5 9 5z" />
                <path d="M12 12l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date: {formatFirestoreTimestamp(item.due_date)}</p>
              <h2 className="text-lg font-medium text-gray-900">
                {item.question}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
