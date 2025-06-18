import { useState, useRef } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import Header from "../../../components/Layout/Header";

export default function CBT() {
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [questionImage, setQuestionImage] = useState(null);
  const [optionImages, setOptionImages] = useState([null, null, null, null]);
  const [essayQuestionImage, setEssayQuestionImage] = useState(null);
  const [fillBlankQuestionImage, setFillBlankQuestionImage] = useState(null);

  const questionImageRef = useRef();
  const essayImageRef = useRef();
  const fillBlankImageRef = useRef();
  const optionImageRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleOptionImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...optionImages];
      updated[index] = URL.createObjectURL(file);
      setOptionImages(updated);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-md">
        <div className="border-b  pb-2 mb-6">
          <p className="text-3xl font-extrabold">Exam Questions</p>
          <p className="text-xs">Add new questions to exam</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Test Timer{" "}
            <span className="text-cyan-600 text-[10px]">
              {" "}
              (that will appear on the student's app during the test and counts
              down, if it ends it automatically submit){" "}
            </span>
          </label>
          <input
            placeholder="in Minutes"
            className="w-full border rounded p-2"
            type="number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Ellapse Time{" "}
            <span className="text-cyan-600 text-[10px]">
              {" "}
              (set by the teacher so that if this time is exceeded the cbt will
              not show on the student's app){" "}
            </span>
          </label>
          <input
            placeholder="in Hours"
            className="w-full border rounded p-2"
            type="number"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              className="w-full border rounded p-2"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option>English</option>
              <option>Maths</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              className="w-full border rounded p-2"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option>JSS1</option>
              <option>SS3</option>
            </select>
          </div>
        </div>

        <h2 className="text-cyan-500 font-semibold mb-4">
          Enter Question Details
        </h2>

        {/* Question Type Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Question Type
          </label>
          <select
            className="w-full border rounded p-2"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option>Multiple Choice</option>
            <option>Essay</option>
            <option>Fill in the Blank</option>
          </select>
        </div>

        {/* MULTIPLE CHOICE FORM */}
        {questionType === "Multiple Choice" && (
          <>
            {/* Question */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Question</label>
              {questionImage ? (
                <div className="relative">
                  <img
                    src={questionImage}
                    alt="question"
                    className="w-full rounded"
                  />
                  <FaTrash
                    className="absolute top-2 right-2 text-red-500 cursor-pointer"
                    onClick={() => setQuestionImage(null)}
                  />
                </div>
              ) : (
                <textarea
                  className="w-full border rounded p-2 h-20"
                  placeholder="e.g. 'What is energy?'"
                />
              )}
              <FaImage
                className="absolute right-2 top-[52px] text-cyan-500 cursor-pointer"
                onClick={() => questionImageRef.current.click()}
              />
              <input
                type="file"
                accept="image/*"
                ref={questionImageRef}
                className="hidden"
                onChange={(e) => handleImageUpload(e, setQuestionImage)}
              />
            </div>

            {/* Options A - D */}
            {["A", "B", "C", "D"].map((option, index) => (
              <div key={index} className="mb-4 relative">
                <label className="block text-sm font-medium mb-1">{`Option ${option}`}</label>
                {optionImages[index] ? (
                  <div className="relative">
                    <img
                      src={optionImages[index]}
                      alt={`Option ${option}`}
                      className="w-full rounded"
                    />
                    <FaTrash
                      className="absolute top-2 right-2 text-red-500 cursor-pointer"
                      onClick={() => {
                        const updated = [...optionImages];
                        updated[index] = null;
                        setOptionImages(updated);
                      }}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Option"
                    className="w-full border rounded p-2"
                  />
                )}
                <FaImage
                  className="absolute right-2 top-[42px] text-cyan-500 cursor-pointer"
                  onClick={() => optionImageRefs[index].current.click()}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={optionImageRefs[index]}
                  className="hidden"
                  onChange={(e) => handleOptionImageUpload(index, e)}
                />
              </div>
            ))}

            {/* Correct Option */}
            <div className="mb-4">
              <p className="text-sm text-red-500 mb-2">
                Which of the Option is the Correct Answer?
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {["A", "B", "C", "D"].map((option, index) => (
                  <label key={index} className="flex items-center gap-1">
                    <input type="radio" name="correctAnswer" />
                    <span>{`Option ${option}`}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ESSAY FORM */}
        {questionType === "Essay" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Essay Question
              </label>
              <textarea
                placeholder="Enter Question"
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4 relative">
              {essayQuestionImage ? (
                <div className="relative">
                  <img
                    src={essayQuestionImage}
                    alt="essay"
                    className="w-full rounded"
                  />
                  <FaTrash
                    className="absolute top-2 right-2 text-red-500 cursor-pointer"
                    onClick={() => setEssayQuestionImage(null)}
                  />
                </div>
              ) : (
                <FaImage
                  className="text-cyan-500 text-2xl cursor-pointer"
                  onClick={() => essayImageRef.current.click()}
                />
              )}
              <input
                type="file"
                accept="image/*"
                ref={essayImageRef}
                className="hidden"
                onChange={(e) => handleImageUpload(e, setEssayQuestionImage)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Essay Answer
              </label>
              <textarea
                placeholder="Essay Answer"
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        {/* FILL IN THE BLANK FORM */}
        {questionType === "Fill in the Blank" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Fill in the Blank Question
              </label>
              <textarea
                placeholder="Enter Question"
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4 relative">
              {fillBlankQuestionImage ? (
                <div className="relative">
                  <img
                    src={fillBlankQuestionImage}
                    alt="fill-blank"
                    className="w-full rounded"
                  />
                  <FaTrash
                    className="absolute top-2 right-2 text-red-500 cursor-pointer"
                    onClick={() => setFillBlankQuestionImage(null)}
                  />
                </div>
              ) : (
                <FaImage
                  className="text-cyan-500 text-2xl cursor-pointer"
                  onClick={() => fillBlankImageRef.current.click()}
                />
              )}
              <input
                type="file"
                accept="image/*"
                ref={fillBlankImageRef}
                className="hidden"
                onChange={(e) =>
                  handleImageUpload(e, setFillBlankQuestionImage)
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Fill in the Blank Answer
              </label>
              <input
                type="text"
                placeholder="Enter Fill in the Blank Answer"
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button className="bg-cyan-500 text-white w-full py-2 rounded mt-4">
          Send Question
        </button>
      </div>
    </>
  );
}
