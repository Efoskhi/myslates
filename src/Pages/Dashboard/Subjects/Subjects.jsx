import { useEffect, useState } from "react";
import Header from "../../../components/Layout/Header";
import { CiCirclePlus } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { CourseCard } from "../../../components/Subjects/CourseCard";
import Pagination from "../../../components/Subjects/Pagination";
import Skeleton from "@mui/material/Skeleton";
import { docQr } from "../../../Logics/docQr"; // Adjust the import based on your project

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subjects data
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      // Replace with your actual fetch logic
      const subjectsData = await docQr("Subjects", { max: 5000 });
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Number of skeleton cards to show while loading
  const skeletonCards = Array.from({ length: 3 });

  // Filter subjects based on search term (case-insensitive)
  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="p-6 flex items-center justify-between">
        <p className="text-2xl font-bold">My Subjects</p>
        <div className="inline-flex gap-6">
          <div
            onClick={() => window.location.assign("/AddSubject")}
            className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
          >
            <CiCirclePlus className="text-xl" />
            Add Subject
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-end gap-6 p-4 border-b">
          <div className="relative lg:w-96 w-1/2">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="inline-flex items-center px-3 py-1.5 text-sm text-gray-800 border rounded-lg hover:bg-gray-50">
            <IoFilter className="w-4 h-4 mr-2" />
            Apply filter
          </button>
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 p-4">
          {loading
            ? skeletonCards.map((_, idx) => <SkeletonCourseCard key={idx} />)
            : filteredSubjects.map((subject) => (
                <CourseCard key={subject.subject_id} subject={subject} />
              ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
};

// A simple skeleton version of the course card
const SkeletonCourseCard = () => {
  return (
    <div className="rounded-md shadow-md overflow-hidden w-full">
      <Skeleton variant="rectangular" width="100%" height={160} />
      <div className="p-4">
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="80%" height={28} />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton variant="text" width="20%" height={16} />
          <Skeleton variant="text" width="10%" height={16} />
          <Skeleton variant="text" width="20%" height={16} />
        </div>
      </div>
    </div>
  );
};

export default Subjects;
