import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import QuizDetailsModal from "./QuizDetailsModal";
import useQuiz from "../../Hooks/useQuiz";

const QuizCard = ({ isOwnSubject }) => {

    const hooks = useQuiz();
    const {
        isLoading,
        quizes,
        quizModalVisible,
        handleQuizClick,
        toggleQuizModalVisible,
    } = hooks;
    
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-blue-700 text-lg font-semibold">
                    📝 <span>Quiz</span>
                </div>
                {isOwnSubject && 
                    <button onClick={() => toggleQuizModalVisible("Add")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                        Add Quiz
                    </button>
                }
            </div>

            {quizModalVisible && 
                <QuizDetailsModal hooks={hooks} isOwnSubject={isOwnSubject}/>
            }
            {!isLoading && quizes.length === 0 &&
                <div className="p-6">
                    <p className="text-center text-gray-500">No quiz available.</p>
                </div>
            }

            {quizes.map((quiz, key) => (
                <div
                    key={key}
                    className="inline-flex items-center w-full justify-between cursor-pointer mb-2"
                    onClick={() => handleQuizClick(quiz)}
                >
                    <div className="flex align-center gap-10">
                        <div>
                            <p className="text-gray-700">Question {quiz.question_number}</p>

                            <p className="font-semibold overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {quiz.question}
                            </p>
                        </div>
                    </div>
                    <MdKeyboardArrowRight />
                </div>
            ))}
        </div>
    );
};

export default QuizCard;
