import { useState } from "react";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough } from "react-icons/fa";

import { FaCloudUploadAlt } from "react-icons/fa";

export const LessonForm = ({ hooks }) => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonNote, setLessonNote] = useState("");
  const [lessonContent, setLessonContent] = useState("");

  const {
    inputs,
    handleInput
  } = hooks;

  return (
    <div className="w-full">
      {/* Lesson Title */}
      <label className="block text-gray-700 font-semibold mb-2">
        Lesson Number
      </label>
      <input
        type="text"
        placeholder="e.g 1"
        value={inputs.lesson.lesson_number}
        onChange={(e) => handleInput("lesson.lesson_number", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {/* Lesson Note */}
      <label className="block text-gray-700 font-semibold mb-2">
        Lesson Examples
      </label>
      <textarea
        placeholder="Tell us about the lesson examples"
        value={inputs.lesson.examples}
        onChange={(e) => handleInput("lesson.examples", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        rows="3"
      />

      <label className="block text-gray-700 font-semibold mb-2">
        Lesson Activities
      </label>
      <textarea
        placeholder="Tell us about the lesson ecivitiy"
        value={inputs.lesson.activities}
        onChange={(e) => handleInput("lesson.activities", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        rows="3"
      />

      {/* Lesson Content with Formatting Options */}
      <label className="block text-gray-700 font-semibold mb-2">
        Lesson Content
      </label>
      <div className="border border-gray-300 rounded-md">
        <div className="flex space-x-2 p-2 border-b bg-gray-100">
          <button className="p-1 text-gray-600 hover:text-blue-500">
            <FaBold />
          </button>
          <button className="p-1 text-gray-600 hover:text-blue-500">
            <FaItalic />
          </button>
          <button className="p-1 text-gray-600 hover:text-blue-500">
            <FaUnderline />
          </button>
          <button className="p-1 text-gray-600 hover:text-blue-500">
            <FaStrikethrough />
          </button>
        </div>
        <textarea
          placeholder="Tell us about the lesson content"
          value={inputs.lesson.content}
          onChange={(e) => handleInput("lesson.content", e.target.value)}
          className="w-full p-2 focus:outline-none"
          rows="5"
        />
      </div>
    </div>
  );
};

const LessonResources = ({ hooks }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [links, setLinks] = useState([""]);
  const [file, setFile] = useState(null);

  const {
    inputs,
    handleInput
  } = hooks;

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="mb-5">
      {/* Video URL */}
      {/* <label className="block text-gray-700 font-semibold mb-2">
        Video URL
      </label>
      <input
        type="text"
        placeholder="e.g http://youtube.com/designmunch/video"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      /> */}

      {/* Useful Links */}
      {/* {links.map((link, index) => (
        <div key={index} className="mb-2">
          <label className="block text-gray-700 font-semibold">
            Useful Link {index + 1}
          </label>
          <input
            type="text"
            placeholder="e.g http://youtube.com/designmunch/video"
            value={link}
            onChange={(e) => {
              const newLinks = [...links];
              newLinks[index] = e.target.value;
              setLinks(newLinks);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))} */}
      {/* <button
        onClick={handleAddLink}
        className="text-blue-500 text-sm mt-1 hover:underline"
      >
        Add more
      </button> */}


      {/* File Upload */}

      <p className="mt-6 font-bold">Image Content</p>
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
            onChange={(e) => handleInput("lesson.img_content", e.target.files?.[0] || null)}
          />
        </label>
        {inputs.lesson.img_content && <p className="text-sm text-gray-600 mt-2">{inputs.lesson.img_content.name}</p>}

      </div>

      <p className="mt-6 font-bold">Image Example</p>
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
            onChange={(e) => handleInput("lesson.img_example", e.target.files?.[0] || null)}
          />
        </label>
        {inputs.lesson.img_example && <p className="text-sm text-gray-600 mt-2">{inputs.lesson.img_example.name}</p>}

      </div>

      {/* Action Buttons */}
      {/* <button className="w-full mt-4 p-2 border text-gray-700 rounded-md hover:bg-gray-300">
        Add Quiz to lesson
      </button>
      <button className="w-full mt-2 p-2 border text-gray-700 rounded-md hover:bg-gray-300">
        Add Assignment to lesson
      </button> */}
    </div>
  );
};

export default function AddLessons({ hooks }) {
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    {
      title: "Lesson Details",
      description: "Fill up the lessons details here",
      component: <LessonForm hooks={hooks}/>,
    },
    {
      title: "Resources",
      description: "Add resources to the lesson",
      component: <LessonResources hooks={hooks}/>,
    },
    // {
    //   title: "Additional Content",
    //   description: "Add more lesson details",
    //   component: <>Helo</>,
    // },
  ];

  return (
    <div className="flex lg:flex-row flex-col mt-8">
      {/* Sidebar */}
      <div className="lg:w-1/4 w-full  py-6">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setCurrentTab(index)}
            className={`py-4 cursor-pointer rounded-md mb-2 ${
              index === currentTab ? " text-black" : "text-gray-500"
            }`}
          >
            <p className="font-bold">{tab.title}</p>
            <p className="text-sm">{tab.description}</p>
          </div>
        ))}
        {/* <div>
          <p className="font-medium">
            Click on the button below to add more lesson
          </p>
          <p className="text-gray-400">Fill the lesson details</p>
          <div className="border-2 font-semibold cursor-pointer text-sm p-2 inline-flex rounded-md mt-4">
            Add more lessons
          </div>
        </div> */}
      </div>

      {/* Content */}
      <div className="lg:w-3/4 w-full lg:p-12 p-0 bg-white">
        {tabs[currentTab].component}
      </div>
    </div>
  );
}
