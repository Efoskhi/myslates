import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Profile from "../../assets/Profile.png";
import Graph from "../../assets/Graph.png";
import Skeleton from "@mui/material/Skeleton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { docQr } from "../../Logics/docQr";

export default function StatCards() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentTimeFilter, setStudentTimeFilter] = useState("Last 30 days");
  const [subjectTimeFilter, setSubjectTimeFilter] = useState("Last 30 days");

  // Utility function to get the start date for a given filter
  const getStartDate = (filter) => {
    const now = new Date();
    if (filter === "Today") {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    if (filter === "Last 7 days") {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (filter === "Last 30 days") {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return new Date(0);
  };

  // Fetch students and subjects data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, subjectsData] = await Promise.all([
        docQr("users", {
          max: 5000,
          whereClauses: [{ field: "role", operator: "==", value: "learner" }],
        }),
        docQr("Subjects", { max: 5000 }),
      ]);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate filtered count and percentage for students
  const studentFilteredCount = students.filter((student) => {
    const studentDate = new Date(student.created_time);
    const filterStart = getStartDate(studentTimeFilter);
    return studentDate >= filterStart;
  }).length;
  const studentPercentage =
    students.length > 0
      ? ((studentFilteredCount / students.length) * 100).toFixed(2)
      : 0;

  // Calculate filtered count and percentage for subjects
  const subjectFilteredCount = subjects.filter((subject) => {
    // Assumes each subject object has a created_time field
    const subjectDate = new Date(subject.created_time);
    const filterStart = getStartDate(subjectTimeFilter);
    return subjectDate >= filterStart;
  }).length;
  const subjectPercentage =
    subjects.length > 0
      ? ((subjectFilteredCount / subjects.length) * 100).toFixed(2)
      : 0;

  // Handlers for dropdown changes
  const handleStudentFilterChange = (event) => {
    setStudentTimeFilter(event.target.value);
  };

  const handleSubjectFilterChange = (event) => {
    setSubjectTimeFilter(event.target.value);
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
      {/* Total Students Card */}
      <div className="bg-[#e4e7ec] p-4 rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <img src={Graph} className="h-6" />
          <div className="flex items-center text-gray-500 text-sm">
            <Select
              value={studentTimeFilter}
              onChange={handleStudentFilterChange}
              size="small"
              sx={{ fontSize: "0.875rem" }}
              IconComponent={IoIosArrowDown}
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Last 7 days">Last 7 days</MenuItem>
              <MenuItem value="Last 30 days">Last 30 days</MenuItem>
            </Select>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          {loading ? (
            <Skeleton variant="text" width={80} height={40} />
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{students.length}</h2>
              <p className="text-gray-500 text-sm">Total Students</p>
            </div>
          )}
          <img src={Profile} className="h-12" />
        </div>
        <div className="mt-4">
          {loading ? (
            <Skeleton variant="text" width={100} height={30} />
          ) : (
            <div>
              <p className="text-sm text-gray-500">
                Students in {studentTimeFilter}:{" "}
                <span className="font-bold">{studentFilteredCount}</span>
              </p>
              <p className="text-sm text-green-800 font-medium bg-green-100 inline-block p-1 rounded-full">
                {studentPercentage}% increase
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Total Subjects Card */}
      <div className="bg-[#e4e7ec] p-4 rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <img src={Graph} className="h-6" />
          <div className="flex items-center text-gray-500 text-sm">
            <Select
              value={subjectTimeFilter}
              onChange={handleSubjectFilterChange}
              size="small"
              sx={{ fontSize: "0.875rem" }}
              IconComponent={IoIosArrowDown}
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Last 7 days">Last 7 days</MenuItem>
              <MenuItem value="Last 30 days">Last 30 days</MenuItem>
            </Select>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          {loading ? (
            <Skeleton variant="text" width={80} height={40} />
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{subjects.length}</h2>
              <p className="text-gray-500 text-sm">Total Subjects</p>
            </div>
          )}
          <img src={Profile} className="h-12" />
        </div>
        <div className="mt-4">
          {loading ? (
            <Skeleton variant="text" width={100} height={30} />
          ) : (
            <div>
              <p className="text-sm text-gray-500">
                Subjects in {subjectTimeFilter}:{" "}
                <span className="font-bold">{subjectFilteredCount}</span>
              </p>
              <p className="text-sm text-green-800 font-medium bg-green-100 inline-block p-1 rounded-full">
                {subjectPercentage}% increase
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
