import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../../components/Layout/Header";
import QuestionsForm from "../../../components/CBT/QuestionsForm";

export default function QuestionsList() {
  const [questions, setQuestions] = useState([
    { id: 1, text: "What is React?" },
    { id: 2, text: "Explain useEffect hook." },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedText, setEditedText] = useState("");

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setEditedText(question.text);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestion.id ? { ...q, text: editedText } : q
      )
    );
    setIsModalOpen(false);
  };

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: newId, text: `Question ${newId} text here...` },
    ]);
  };

  return (
    <div className="">
      <Header />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">LAw and Order CBT Questions</h1>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white shadow-md p-4 rounded mb-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold mb-1">Question {index + 1}</h2>
              <p className="text-sm text-gray-600">{q.text}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(q)} className="text-blue-500">
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Footer Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleAddQuestion}
            className="bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>
          <button className="bg-cyan-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-md p-6 w-full max-w-5xl shadow-lg relative overscroll-y-auto overflow-y-auto h-[90vh]">
              <div className="overscroll-y-auto overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-black font-bold"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
                <h2 className="text-lg font-bold mb-4">Edit Question</h2>
                <QuestionsForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
