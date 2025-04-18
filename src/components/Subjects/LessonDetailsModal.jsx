import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Face from "../../assets/Face2.png";
import Loading from "../Layout/Loading";
import LessonDeleteModal from "./LessonDeleteModal";

const LessonDetailsModal = ({ hooks }) => {
  const [ deleteModalVisible, setDeleteModalVisible ] = React.useState(false);

  const { 
    inputs, 
    handleInputs, 
    section, 
    isSaving,
    toggleLessonModalVisible,
    handleAddLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  } = hooks;

  const toggleDeleteModal = () => setDeleteModalVisible(prev => !prev);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
      {section === "Update" && deleteModalVisible &&
        <LessonDeleteModal 
          toggleModal={toggleDeleteModal}
          handleDeleteLesson={handleDeleteLesson}
          isSaving={isSaving}
          lesson={inputs}
        />
      }

      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-full justify-end overflow-y-auto overscroll-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 ">
          <h2 className="text-xl font-semibold">Lesson Details</h2>
          <button onClick={toggleLessonModalVisible}>
            <IoClose className="text-xl text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className=" text-xs">
          {/* Lesson Title */}
          {/* <div className="mb-4">
            <label className="block font-semibold">Lesson Title</label>
            <input
              type="text"
              placeholder="e.g Introduction to Economics"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div> */}

          {/* Lesson Description */}
          <div className="mb-4">
            <label className="block font-semibold">Lesson Activities</label>
            <textarea
              placeholder="The lesson is supposed"
              className="w-full mt-1 p-2 border rounded-md"
              maxLength={200}
              value={inputs.activities}
              onChange={e => handleInputs("activities", e.target.value)}
            >
            </textarea>
          </div>

          {/* Lesson Content */}
          <div className="mb-4">
            <label className="block font-semibold">Lesson Content</label>
            <textarea
              placeholder="Tell us about the Lesson"
              className="w-full mt-1 p-2 border rounded-md"
              value={inputs.content}
              onChange={e => handleInputs("content", e.target.value)}
            >
            </textarea>
          </div>

          {/* Lesson Content */}
          <div className="mb-4">
            <label className="block font-semibold">Lesson examples</label>
            <textarea
              placeholder="Examples of lesson"
              className="w-full mt-1 p-2 border rounded-md"
              value={inputs.examples}
              onChange={e => handleInputs("examples", e.target.value)}
            >
            </textarea>
          </div>

          {/* Resource File Upload */}
          <div className="border p-4 rounded-md mb-4">
            <label className="block font-semibold mb-2">Image Content</label>
            <div className="border p-4 flex items-center justify-between rounded-md cursor-pointer">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                onChange={e => handleInputs('img_content', e.target.files[0])}
              />
              <label
                htmlFor="fileUpload"
                className="flex items-center cursor-pointer"
              >
                {inputs.img_content ? (
                  <span className="text-sm">{inputs.img_content.name}</span>
                ) : (
                  <span className="text-gray-500">Tap to Upload</span>
                )}
                {typeof inputs.img_content === "string" && inputs.img_content && 
                  <img src={inputs.img_content} className="w-full" />
                }
              </label>
              <button className="bg-blue-500 text-white px-4 py-1 rounded-md">
                Upload
              </button>
            </div>
          </div>

          <div className="border p-4 rounded-md mb-4">
            <label className="block font-semibold mb-2">Image Example</label>
            <div className="border p-4 flex items-center justify-between rounded-md cursor-pointer">
              <input
                type="file"
                className="hidden"
                id="fileUpload_example"
                onChange={e => handleInputs('img_example', e.target.files[0])}
              />
              <label
                htmlFor="fileUpload_example"
                className="flex items-center cursor-pointer"
              >
                {inputs.img_example ? (
                  <span className="text-sm">{inputs.img_example.name}</span>
                ) : (
                  <span className="text-gray-500">Tap to Upload</span>
                )}
                {typeof inputs.img_example === "string" && inputs.img_example && 
                  <img src={inputs.img_example} className="w-full" />
                }
              </label>
              <button className="bg-blue-500 text-white px-4 py-1 rounded-md">
                Upload
              </button>
            </div>
          </div>

          {/* Video URL */}
          {/* <div className="mb-4">
            <label className="block font-semibold">Video URL</label>
            <input
              type="text"
              placeholder="http://youtube.com/designmunch/video"
              className="w-full mt-1 p-2 border rounded-md"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div> */}

          {/* Useful Links */}
          {/* {usefulLinks.map((link, index) => (
            <div key={index} className="mb-4">
              <label className="block font-semibold">
                Useful Link URL {index + 1}
              </label>
              <input
                type="text"
                placeholder="http://youtube.com/designmunch/video"
                className="w-full mt-1 p-2 border rounded-md"
                value={link}
                onChange={(e) => handleUsefulLinkChange(index, e.target.value)}
              />
            </div>
          ))} */}

          {/* Action Buttons */}
          {section === "Update" ? (
              <div className="flex justify-between mt-4">
                <button disabled={isSaving} onClick={handleUpdateLesson} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md">
                  {isSaving ? <Loading/> : "Edit Lesson"}
                </button>
                <button onClick={toggleDeleteModal} className="border border-red-500 text-red-500 px-4 py-2 rounded-md">
                  Delete Lesson
                </button>
              </div>
          ) : (
            <button disabled={isSaving} onClick={handleAddLesson} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md">
              {isSaving ? <Loading/> : "Add Lesson"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailsModal;
