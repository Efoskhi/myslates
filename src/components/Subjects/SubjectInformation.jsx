import React, { useRef, useState } from "react";
import { FaImages, FaUpload } from "react-icons/fa";
import useCurriculums from "../../Hooks/useCurriculums";
import useClasses from "../../Hooks/useClasses";
import useDepartments from "../../Hooks/useDepartments";

const SubjectInformation = ({ hooks }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    inputs,
    handleInput
  } = hooks;

  const { curriculums } = useCurriculums();
  const { classes } = useClasses();
  const { departments } = useDepartments();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleInput("subject.thumbnail", file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Triggers the hidden input
  };

  React.useEffect(() => {
    if(inputs.subject.thumbnail){
      const imageUrl = URL.createObjectURL(inputs.subject.thumbnail);
      setSelectedImage(imageUrl);
    }
    
  }, [])

  return (
    <div className="py-6 grid lg:grid-cols-2 grid-cols-1 gap-6 w-full">
      <div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 text-xs ">Curriculum</label>
            <select 
              className="w-full p-2 border rounded-lg"
              onChange={e => handleInput("subject.curriculum", e.target.value)}
              value={inputs.subject.curriculum}
            >
              <option value="">Select Curriculum</option>
              {curriculums.map((curriculum, key) => (
                  <option option={curriculum.name} key={key}>{curriculum.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-xs">Class</label>
            <select 
              className="w-full p-2 border rounded-lg"
              onChange={e => handleInput("subject.className", e.target.value)}
              value={inputs.subject.className}
            >
              <option value="">Select Class</option>
              {classes.map((item, key) => (
                  <option option={item.student_class} key={key}>{item.student_class}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-xs">Department</label>
            <select 
              className="w-full p-2 border rounded-lg"
              onChange={e => handleInput("subject.department", e.target.value)}
              value={inputs.subject.department}
            >
              <option value="">Select Department</option>
              {departments.map((item, key) => (
                  <option option={item.title} key={key}>{item.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-xs">Subject Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Name of subject"
            onChange={e => handleInput("subject.title", e.target.value)}
            value={inputs.subject.title}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-xs">Description</label>
          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Tell us about the subject"
            onChange={e => handleInput("subject.description", e.target.value)}
            value={inputs.subject.description}
          />
        </div>

        {/* <div className="mt-4">
          <label className="block text-gray-700 text-xs">Assign Teachers</label>
          <select className="w-full p-2 border rounded-lg">
            <option>Ms Vee Egun</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-gray-700 text-xs">
              Registration Start Date
            </label>
            <input type="date" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-gray-700 text-xs">
              Registration End Date
            </label>
            <input type="date" className="w-full p-2 border rounded-lg" />
          </div>
        </div> */}
      </div>

      <div className="">
        <label className="block text-black font-bold">Subject Image</label>
        <p className="text-[#667185] text-xs">
          This image will be displayed on students profile
        </p>
        <div>
          {/* Custom Add Image Button */}
          <div
            className="border inline-flex p-2 gap-2 mt-4 rounded-md cursor-pointer"
            onClick={handleButtonClick}
          >
            <FaImages /> <p className="text-xs">Add image</p>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />

          {/* Display Selected Image */}
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-40 h-40 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectInformation;
