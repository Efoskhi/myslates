import React from "react";

import { useState, useRef } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import Loading from "../Layout/Loading";

const QuestionsForm = ({ hooks, isAddModal, callback }) => {
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [questionImage, setQuestionImage] = useState(null);
  const [optionImages, setOptionImages] = useState([null, null, null, null]);
  const [essayQuestionImage, setEssayQuestionImage] = useState(null);
  const [fillBlankQuestionImage, setFillBlankQuestionImage] = useState(null);

  const questionImageRef = useRef();
  const essayImageRef = useRef();
  const fillBlankImageRef = useRef();
  const optionImageRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleImageUpload = (e, setImage, field) => {
    const file = e.target.files[0];
    if (file) { 
      handleInput(field, file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleOptionImageUpload = (index, e, option) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...optionImages];
      updated[index] = URL.createObjectURL(file);
      handleInput(`question.img_option_${option}.option_${option}`, file);
      setOptionImages(updated);
    }
  };

  const {
    inputs,
    handleInput,
    isSaving,
    handleAddInstanceQuestion,
    resetInput,
    handleUpdateInstanceQuestion,
  } = hooks;

  const handleQuestionChange = (e) => {
    setOptionImages([null, null, null, null]);
    setQuestionImage(null);
    setEssayQuestionImage(null);
    setFillBlankQuestionImage(null);
    resetInput(inputs.question, e.target.value);
    handleInput("question.question_type", e.target.value);
  }

  const removeQuestionImage = (field, callback) => {
    handleInput(field, "")
    callback(null);
  }


  const generateImgUrl = (field, fallback) => {
    const resolvedImageSrc =
    typeof inputs.question[field] === 'string' && inputs.question[field]
      ? inputs.question[field]
      : fallback;

    return resolvedImageSrc;
  }


  return (
    <div>
      <h2 className="text-cyan-500 font-semibold mb-4">
        Enter Question Details
      </h2>

      {/* Question Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Question Type</label>
        <select
          className="w-full border rounded p-2"
          value={inputs.question.question_type}
          onChange={handleQuestionChange}
        >
          <option>Multiple Choice</option>
          <option>Essay</option>
          <option>Fill in the Blank</option>
        </select>
      </div>

      {/* MULTIPLE CHOICE FORM */}
      {inputs.question.question_type === "Multiple Choice" && (
        <>
          {/* Question */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Question</label>
            {questionImage || inputs.question.img_mc_question ? (
              <div className="relative">
                <img
                  src={generateImgUrl('img_mc_question', questionImage)}
                  alt="question"
                  className="w-full rounded"
                />
                <FaTrash
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  onClick={() => removeQuestionImage("question.img_mc_question", setQuestionImage)}
                />
              </div>
            ) : (
              <textarea
                className="w-full border rounded p-2 h-20"
                placeholder="e.g. 'What is energy?'"
                onChange={e => handleInput("question.mc_question", e.target.value)}
                value={inputs.question.mc_question}
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
              onChange={(e) => handleImageUpload(e, setQuestionImage, 'question.img_mc_question.mc_question')}
            />
          </div>

          {/* Options A - D */}
          {["A", "B", "C", "D"].map((option, index) => (
            <div key={index} className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">{`Option ${option}`}</label>
              {optionImages[index] || inputs.question[`img_option_${option.toLowerCase()}`]  ? (
                <div className="relative">
                  <img
                    src={generateImgUrl(`img_option_${option.toLowerCase()}`, optionImages[index])}
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
                  onChange={e => handleInput(`question.option_${option.toLowerCase()}.img_option_${option.toLowerCase()}`, e.target.value)}
                  value={inputs.question[`option_${option.toLowerCase()}`]}
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
                onChange={(e) => handleOptionImageUpload(index, e, option.toLowerCase())}
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
                  <input 
                    type="radio" 
                    name="correctAnswer" 
                    onChange={e => handleInput("question.mc_answer", option)}
                    checked={inputs.question.mc_answer.toLowerCase() === option.toLowerCase()}
                  />
                  <span>{`Option ${option}`}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ESSAY FORM */}
      {inputs.question.question_type === "Essay" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Essay Question
            </label>
            <textarea
              placeholder="Enter Question"
              className="w-full border rounded p-2"
              onChange={e => handleInput("question.essay_question", e.target.value)}
              value={inputs.question.essay_question}
            />
          </div>
          <div className="mb-4 relative">
            {essayQuestionImage || inputs.question.img_essay_question  ? (
              <div className="relative">
                <img
                  src={generateImgUrl('img_essay_question', essayQuestionImage)}
                  alt="essay"
                  className="w-full rounded"
                />
                <FaTrash
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  onClick={() => removeQuestionImage("question.img_essay_question", setEssayQuestionImage)}
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
              onChange={(e) => handleImageUpload(e, setEssayQuestionImage, 'question.img_essay_question')}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Essay Answer
            </label>
            <textarea
              placeholder="Essay Answer"
              className="w-full border rounded p-2"
              onChange={e => handleInput("question.essay_answer", e.target.value)}
              value={inputs.question.essay_answer}
            />
          </div>
        </>
      )}

      {/* FILL IN THE BLANK FORM */}
      {inputs.question.question_type === "Fill in the Blank" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Fill in the Blank Question
            </label>
            <textarea
              placeholder="Enter Question"
              className="w-full border rounded p-2"
              onChange={e => handleInput("question.fillblank_question", e.target.value)}
              value={inputs.question.fillblank_question}

            />
          </div>
          <div className="mb-4 relative">
            {fillBlankQuestionImage || inputs.question.img_fillblank_question ? (
              <div className="relative">
                <img
                  src={generateImgUrl('img_fillblank_question', fillBlankQuestionImage)}
                  alt="fill-blank"
                  className="w-full rounded"
                />
                <FaTrash
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  onClick={() => removeQuestionImage("question.img_fillblank_question", setFillBlankQuestionImage)}
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
              onChange={(e) => handleImageUpload(e, setFillBlankQuestionImage, 'question.img_fillblank_question')}
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
              onChange={e => handleInput("question.fillblank_answer", e.target.value)}
              value={inputs.question.fillblank_answer}
            />
          </div>
        </>
      )}

      {/* Submit */}
      <button 
        className="bg-cyan-500 text-white w-full py-2 rounded mt-4" 
        onClick={() => isAddModal ? handleAddInstanceQuestion(callback) : handleUpdateInstanceQuestion(callback)} 
      >
        {isSaving ? <Loading/> : isAddModal ? "Add Question" : "Update Question" }
      </button>
    </div>
  );
};

export default QuestionsForm;
