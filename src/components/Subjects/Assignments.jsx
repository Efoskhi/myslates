import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import useClasses from "../../Hooks/useClasses";

const AddAssignment = ({ hooks }) => {
  const [questions, setQuestions] = useState([""]);
  const [files, setFiles] = useState({});

  const {
    inputs,
    handleInput
  } = hooks;

  const { classes } = useClasses();

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleFileUpload = (event, index) => {
    const newFiles = { ...files, [index]: event.target.files[0] };
    setFiles(newFiles);
  };

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:p-4 p-0">
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Add Assignment
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Fill the assignment question here
        </p>
      </div>

      <div className="col-span-2">
        {/* Associated Lesson */}
        <label className="block font-bold mb-1">Assignment Number</label>
        <input
          type="text"
          value={inputs.assignment.assignment_no}
          onChange={e => handleInput("assignment.assignment_no", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 mb-4"
        />

        <label className="block font-bold mb-1">Max Mark</label>
        <input
          type="tel"
          value={inputs.assignment.max_mark}
          onChange={e => handleInput("assignment.max_mark", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 mb-4"
        />

        <label className="block font-bold mb-1">Due Date</label>
        <input
          type="date"
          value={inputs.assignment.due_date}
          onChange={e => handleInput("assignment.due_date", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 mb-4"
        />

        <div className="my-4">
            <label className="block font-semibold text-sm mb-1">
                Associated Class
            </label>
            <select
                value={inputs.assignment.className}
                onChange={(e) => handleInput("assignment.className", e.target.value)}
                className="w-full p-2 border rounded-md"
            >
                <option value="">Select Class</option>
                {classes.map((item, key) => (
                    <option value={item.student_class} key={key}>
                        {item.student_class}
                    </option>
                ))}
            </select>
        </div>

        {/* Questions */}
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <label className="block font-bold mb-1">Question</label>

            <input
              type="text"
              placeholder="Enter question"
              value={inputs.assignment.question}
              onChange={e => handleInput("assignment.question", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* File Upload */}
            <p className="mt-6 font-bold">Image</p>
            <div className="mt-4 p-6 border border-dashed border-gray-400 rounded-lg text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <FaCloudUploadAlt className="text-4xl text-gray-500" />
                <span className="text-gray-600">Choose a file to upload</span>
                <span className="text-xs text-gray-400">
                  SVG, PNG or JPG Formats (max. 10Mb)
                </span>
                <input
                  type="file"
                  accept=".svg,.png,.jpg"
                  className="hidden"
                  onChange={(e) => handleInput("assignment.image", e.target.files[0])}
                />
              </label>
              {inputs.assignment.image && <p className="text-sm text-gray-600 mt-2">{inputs.assignment.image.name}</p>}
            </div>
          </div>
        ))}

        {/* Add More Question Button */}
        {/* <button
          onClick={handleAddQuestion}
          className="w-full mt-4 p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Add more Question
        </button> */}
      </div>
    </div>
  );
};

export default AddAssignment;
