import React from "react";
import Course from "../../../assets/Avatar.png";
import Header from "../../../components/Layout/Header";
import useCBT from "../../../Hooks/useCBT";
import { useParams } from "react-router-dom";
import Loading from "../../../components/Layout/Loading";
import { formatFirestoreTimestamp } from "../../../utils";

const results = [
  {
    studentname: "Monkey D Luffy",
    date: "Sun, Jun 29 at 10:53 PM",
    score: 14,
    maxScore: 20,
    totalQuestions: 10,
    tag: "Computing",
    image: Course,
  },
  {
    studentname: "Johnny Bravo",
    date: "Sat, Jun 28 at 7:47 PM",
    score: 1,
    maxScore: 5,
    totalQuestions: 3,
    tag: "Chemistry",
    image: Course, // Replace with actual image
  },
];

export default function CBTResults() {

  const { id: cbtId } = useParams();

  const { isLoading, cbtResults } = useCBT({ shouldGetResults: true, cbtId })

  return (
    <div className="min-h-screen bg-cyan-50 ">
      {/* Header */}
      <Header />
      <div className="bg-cyan-600 text-white text-lg font-semibold p-4 rounded-t-md  my-6">
        CBT Result
      </div>

      {/* Results List */}
      { isLoading && <Loading/> }
      <div className="mt-4 grid sm:grid-cols-4 gap-4">
        {cbtResults?.CBT_Results?.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex items-start gap-4"
          >
            {item.student.photo_url && (
              <img
                src={item.student.photo_url}
                alt="studentname"
                className="w-20 h-20 object-cover rounded"
              />
            )}

            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-800">
                {item.student.display_name}
              </h2>
              <p className="text-xs text-gray-500 mb-1">{formatFirestoreTimestamp(item.timestamp)}</p>
              <p className="text-sm font-semibold">
                Score: <span className="text-black">{item.total_score}</span>
              </p>
              <p className="text-xs text-gray-600">
                Maximum Score: {item.maximum_score}
              </p>
              <p className="text-xs text-gray-600">
                Total Questions: {item.total_question}
              </p>
              <button className="mt-2 bg-white border border-blue-400 text-blue-500 text-sm px-3 py-1 rounded-md">
                {cbtResults.subject_ref.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
