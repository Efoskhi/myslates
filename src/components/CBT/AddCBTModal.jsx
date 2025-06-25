import React from "react";
import { useState, useRef } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
// import { UseCBTReturnType } from "../../Hooks/useCBT";
import Loading from "../Layout/Loading";

const AddCBTModal = ({ setIsOpen, hooks, isAddInstance }) => {
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [thumbnail, setThumbnail] = useState(null);
  const fileInputRef = useRef();

  const [activeTab, setActiveTab] = useState("external");

  const {
    isSaving,
    inputs,
    subjects,
    classes,
    handleInput,
    handleCreateInstance,
    handleUpdateInstance,
  } = hooks;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleInput("instance.thumbnail", file);

      const imageURL = URL.createObjectURL(file);
      setThumbnail(imageURL);
    }
  };

  const sectionText = isAddInstance ? "Add" : "Update";

  const generateImgUrl = (field, fallback) => {
    const resolvedImageSrc =
      typeof inputs.instance[field] === "string" && inputs.instance[field]
        ? inputs.instance[field]
        : fallback;

    return resolvedImageSrc;
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
              <p className="text-3xl font-extrabold">{sectionText} CBT</p>
              <p className="text-xs">{sectionText} new CBT Instance</p>
            </div>

            <div className="py-4">
              {/* Tabs */}
              <div className="flex space-x-4  pb-2 mb-4">
                <div
                  onClick={() => setActiveTab("self")}
                  className={`cursor-pointer px-4 py-2 font-medium ${
                    activeTab === "self"
                      ? "border-b-2 border-cyan-500 text-cyan-600"
                      : "text-gray-600"
                  }`}
                >
                  Self Generated Questions
                </div>
                <div
                  onClick={() => setActiveTab("external")}
                  className={`cursor-pointer px-4 py-2 font-medium ${
                    activeTab === "external"
                      ? "border-b-2 border-cyan-500 text-cyan-600"
                      : "text-gray-600"
                  }`}
                >
                  External CBT Link
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "external" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      External URL Link{" "}
                      <span className="text-[10px] text-cyan-600">
                        Incase the CBT test is from an External Source, pls
                        provide Link
                      </span>
                    </label>
                    <input
                      placeholder="Enter Url"
                      className="w-full border rounded p-2"
                      type="url"
                    />
                  </div>
                )}
                {activeTab === "self" && (
                  <span className="text-[10px] text-cyan-600">
                    Incase the CBT test is Self Generated Questions..
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  className="w-full border rounded p-2"
                  onChange={(e) =>
                    handleInput("instance.subject_id", e.target.value)
                  }
                  value={inputs.instance.subject_id}
                >
                  <option value="" selected disabled>
                    Select Subject
                  </option>
                  {subjects.map((item, key) => (
                    <option value={item.id} key={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  className="w-full border rounded p-2"
                  onChange={(e) =>
                    handleInput("instance.class_id", e.target.value)
                  }
                  value={inputs.instance.class_id}
                >
                  <option value="" selected disabled>
                    Select Class
                  </option>
                  {classes.map((item, key) => (
                    <option value={item.id} key={key}>
                      {item.student_class}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title </label>
              <input
                placeholder=""
                className="w-full border rounded p-2"
                type="text"
                onChange={(e) => handleInput("instance.title", e.target.value)}
                value={inputs.instance.title}
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
                onChange={(e) =>
                  handleInput("instance.instruction", e.target.value)
                }
                value={inputs.instance.instruction}
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
                {thumbnail || inputs.instance.thumbnail ? (
                  <img
                    src={generateImgUrl("thumbnail", thumbnail)}
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
                type="text"
                onChange={(e) =>
                  handleInput("instance.allowed_time", Number(e.target.value))
                }
                value={inputs.instance.allowed_time}
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
                onChange={(e) =>
                  handleInput("instance.closing_date", e.target.value)
                }
                value={inputs.instance.closing_date}
              />
            </div>

            {/* Submit */}
            <button
              className="bg-cyan-500 text-white w-full py-2 rounded mt-4"
              onClick={
                isAddInstance ? handleCreateInstance : handleUpdateInstance
              }
            >
              {isSaving ? <Loading /> : sectionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCBTModal;
