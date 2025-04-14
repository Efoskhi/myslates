import { FaBook, FaUsers } from "react-icons/fa";
import Course from "../../assets/Course.png";
import { useNavigate } from "react-router-dom";

export const CourseCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log({subject})
    sessionStorage.setItem("subject", JSON.stringify(subject));
    navigate("/SubjectDetails"); // Update the route as needed
  };

  // Destructure subject data; adjust property names based on your data
  const { subject_id, title, grade = "GRADE 1", lessons = 0, studentsCount = 0, thumbnail } = subject;

  return (
    <div
      className="rounded-md shadow-md overflow-hidden w-full cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={thumbnail || Course} // Use provided thumbnail or fallback image
        alt="Course Thumbnail"
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <p className="text-sm text-gray-500">{grade}</p>
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <FaBook className="mr-1 text-[#0598ce]" /> {lessons} Lessons
          <span className="mx-2">|</span>
          <FaUsers className="mr-1 text-[#0598ce]" /> {studentsCount} Students
        </div>
      </div>
    </div>
  );
};
