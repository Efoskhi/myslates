import React from "react";
import { useState, useRef } from "react";
import { FaImage, FaTrash } from "react-icons/fa";

const AddCBTModal = ({ setIsOpen }) => {
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [thumbnail, setThumbnail] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);
      setThumbnail(imageURL);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-5xl shadow-lg relative overscroll-y-auto overflow-y-auto h-[90vh]">
        <div className="overscroll-y-auto overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-black font-bold text-2xl"
          >
            &times;
          </button>
          <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-md">
            <div className="border-b  pb-2 mb-6">
              <p className="text-3xl font-extrabold">Add CBT</p>
              <p className="text-xs">Add new CBT Instance</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
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

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title </label>
              <input
                placeholder=""
                className="w-full border rounded p-2"
                type="text"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Instructions{" "}
              </label>
              <textarea
                placeholder=""
                className="w-full border rounded p-2"
                type="text"
                rows={4}
              />
            </div>

            <div className="pb-4 ">
              <label className="block text-sm font-medium mb-1">
                ThumbNail Image
              </label>
              <div
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={() => fileInputRef.current.click()}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <FaImage className="text-3xl text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Exam Duration{" "}
                <span className="text-cyan-600 text-[10px]">
                  {" "}
                  (that will appear on the student's app during the test and
                  counts down, if it ends it automatically submit){" "}
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
                Closing Date{" "}
                <span className="text-cyan-600 text-[10px]">
                  (set by the teacher so that if this time is exceeded the CBT
                  will not show on the student&apos;s app)
                </span>
              </label>
              <input
                type="datetime-local"
                className="w-full border rounded p-2"
              />
            </div>

            {/* Submit */}
            <button className="bg-cyan-500 text-white w-full py-2 rounded mt-4">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCBTModal;
