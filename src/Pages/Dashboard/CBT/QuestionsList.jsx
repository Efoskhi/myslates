import { useState, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../../components/Layout/Header";
import QuestionsForm from "../../../components/CBT/QuestionsForm";
import { useNavigate, useParams } from 'react-router-dom';
import useCBT from "../../../Hooks/useCBT";
import Loading from "../../../components/Layout/Loading";

export default function QuestionsList() {
  const [questions, setQuestions] = useState([
    { id: 1, text: "What is React?" },
    { id: 2, text: "Explain useEffect hook." },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ deleteModalData , setDeleteModalData] = useState(null);
  const [editedText, setEditedText] = useState("");
  const isAddModal = useRef(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const hooks = useCBT({ cbtId: id, shoulGetQuestions: true });
  const { 
    instanceData, 
    isLoading, 
    inputs, 
    isSaving,
    setInputs, 
    resetInput, 
    handleConfirmQuestionDelete 
  } = hooks;

  const handleEdit = (question) => {
    isAddModal.current = false;
    setSelectedQuestion(question);

    delete question.created_time;

    setInputs(prev => ({
      ...prev,
      question: {
        ...prev.question,
        ...question
      }
    }))

    setEditedText(question.text);
    setIsModalOpen(true);
  };

  const handleDelete = (question) => {
    setDeleteModalData(question)
    // setQuestions(questions.filter((q) => q.id !== id));
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
    isAddModal.current = true;

    resetInput(inputs.question, "Multiple Choice");

    return setIsModalOpen(true);

    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: newId, text: `Question ${newId} text here...` },
    ]);
  };

  const callback = () => {
    setIsModalOpen(false);
  }

  const getQuestionAndAnswer = (question) => {
    if(question.question_type === "Multiple Choice") {
      return {
        question: question.mc_question,
        answer: question.mc_answer,
      }
    }

    if(question.question_type === "Essay") {
      return {
        question: question.essay_question,
        answer: question.essay_answer,
      }
    }

    if(question.question_type === "Fill in the Blank") {
      return {
        question: question.fillblank_question,
        answer: question.fillblank_answer,
      }
    }

    return {
      question: "--",
      answer: "--",
    }


  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const deleteCallback = () => {
    setDeleteModalData(null);
  }

  return (
    <div className="">
      <Header />

      {isLoading ? <Loading/> : !instanceData ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="text-5xl mb-4">📘</div>
          <p className="text-xl font-semibold text-gray-600">CBT was not found</p>
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{ instanceData.title }</h1>

          {/* Footer Buttons */}
          <div className="flex justify-between my-6">
            <div />
            <button
              onClick={handleAddQuestion}
              className="bg-cyan-600 text-white px-4 py-2 rounded "
            >
              Add Question
            </button>
            {/* <button className="bg-cyan-600 text-white px-4 py-2 rounded">
              Submit
            </button> */}
          </div>

          {instanceData.CBT_Question?.map((q, index) => {
            const { question, answer } = getQuestionAndAnswer(q);
            return (
              <div
                key={q.id}
                className="bg-white shadow-md p-4 rounded mb-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold mb-1">{ question }</h2>
                  <p className="text-sm text-gray-600">{ answer }</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(q)} className="text-blue-500">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(q)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )
          })}

          {!instanceData.CBT_Question?.length && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-xl font-semibold text-gray-700">No questions found</h2>
              <p className="text-gray-500 mt-2">Start by adding your first question to this CBT.</p>
            </div>
          )}


          {/* Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-md p-6 w-full max-w-5xl shadow-lg relative overscroll-y-auto overflow-y-auto h-[90vh]">
                <div className="overscroll-y-auto overflow-y-auto">
                  <button
                    className="absolute top-2 right-2 text-black font-bold"
                    onClick={handleCloseModal}
                  >
                    &times;
                  </button>
                  <h2 className="text-lg font-bold mb-4">{isAddModal.current ? 'Add' : 'Edit'} Question</h2>
                  <QuestionsForm hooks={hooks} isAddModal={isAddModal.current} callback={callback} />
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {deleteModalData && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg relative h-auto">
                <div className="text-center">
                  <div className="text-5xl mb-4">🗑️</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Delete Question?</h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this question? This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setDeleteModalData(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmQuestionDelete(deleteModalData, deleteCallback)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                      disabled={isSaving}
                    >
                      {isSaving ? <Loading/> : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      
    </div>
  );
}
