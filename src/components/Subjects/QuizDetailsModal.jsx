import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaTimesCircle,
} from "react-icons/fa";
import Face from "../../assets/Face2.png";
import Loading from "../Layout/Loading";
import QuizDeleteModal from "./QuizDeleteModal";

const QuizDetailsModal = ({ hooks }) => {
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

    const {
        inputs,
        handleInputs,
        section,
        isSaving,
        toggleQuizModalVisible,
        handleAddQuiz,
        handleUpdateQuiz,
        handleDeleteQuiz,
    } = hooks;

    const toggleDeleteModal = () => setDeleteModalVisible((prev) => !prev);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
            {section === "Update" && deleteModalVisible && (
                <QuizDeleteModal
                    toggleModal={toggleDeleteModal}
                    handleDeleteQuiz={handleDeleteQuiz}
                    isSaving={isSaving}
                    quiz={inputs}
                />
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-full justify-end overflow-y-auto overscroll-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 ">
                    <h2 className="text-xl font-semibold">Quiz Details</h2>
                    <button onClick={toggleQuizModalVisible}>
                        <IoClose className="text-xl text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <div className=" text-xs">
                    {/* Quiz Title */}
                    {/* <div className="mb-4">
            <label className="block font-semibold">Quiz Title</label>
            <input
              type="text"
              placeholder="e.g Introduction to Economics"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div> */}

                    {/* Quiz Description */}
                    <div className="mb-4">
                        <label className="block font-semibold">
                            Question Number
                        </label>
                        <input
                            placeholder="Enter the question number (e.g. 3)"
                            className="w-full mt-1 p-2 border rounded-md"
                            value={inputs.question_number}
                            onChange={(e) =>
                                handleInputs("question_number", e.target.value)
                            }
                        />
                    </div>

                    {/* Quiz Content */}
                    <div className="mb-4">
                        <label className="block font-semibold">Question</label>
                        <textarea
                            placeholder="Enter your question"
                            className="w-full mt-1 p-2 border rounded-md"
                            value={inputs.question}
                            onChange={(e) =>
                                handleInputs("question", e.target.value)
                            }
                        ></textarea>
                    </div>

                    <div className="space-y-3">
                        <label className="block font-semibold mb-2">Answers</label>

                        {["a", "b", "c", "d"].map((opt) => (
                            <div key={opt} className="flex items-center gap-3">
                                <label className="w-6 text-gray-700 font-medium uppercase">
                                    ({opt})
                                </label>
                                <input
                                    type="text"
                                    placeholder={`Option ${opt.toUpperCase()}`}
                                    value={inputs[`option${opt.toUpperCase()}`]}
                                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={e => handleInputs(`option${opt.toUpperCase()}`, e.target.value)}

                                />
                            </div>
                        ))}
                    </div>

                    <div className="mb-5 mt-5">
                        <label className="block font-semibold mb-2">Correct Option</label>
                        <div className="flex flex-col gap-3">
                            {["a", "b", "c", "d"].map((opt) => (
                                <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="correctOption"
                                        value={opt}
                                        className="text-blue-600 focus:ring-blue-500"
                                        checked={inputs.answer === opt.toUpperCase()}
                                        onChange={e => handleInputs('answer', opt.toUpperCase())}
                                    />
                                    <span className="uppercase font-medium">Option {opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Action Buttons */}
                    {section === "Update" ? (
                        <div className="flex justify-between mt-4">
                            <button
                                disabled={isSaving}
                                onClick={handleUpdateQuiz}
                                className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md"
                            >
                                {isSaving ? <Loading /> : "Edit Quiz"}
                            </button>
                            <button
                                onClick={toggleDeleteModal}
                                className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
                            >
                                Delete Quiz
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled={isSaving}
                            onClick={() => handleAddQuiz()}
                            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md"
                        >
                            {isSaving ? <Loading /> : "Add Quiz"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizDetailsModal;
