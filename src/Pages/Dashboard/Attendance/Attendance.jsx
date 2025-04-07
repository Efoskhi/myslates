import React, { useEffect, useMemo, useState } from "react";
import Header from "../../../components/Layout/Header";
import { GoDownload } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";
import { MdFace, MdKeyboardArrowDown } from "react-icons/md";
import { FaSearch, FaUserEdit } from "react-icons/fa";
import TakeAttendanceModal from "../../../components/Attendance/TakeAttendanceModal";
import AttendanceTable from "../../../components/Attendance/AttendanceTable";
import TakeManuallyModal from "../../../components/Attendance/TakeManuallyModal";
import Pagination from "../../../components/Attendance/Pagination";
import { docQr } from "../../../Logics/docQr_ORGate";
import toast from "react-hot-toast";
import { useStudents } from "../../../Hooks/useStudents";
import { format, subDays, isAfter, isBefore, parseISO, isWithinInterval, isEqual } from "date-fns";
import { ClipLoader } from "react-spinners";
const Attendance = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendance, setAttendance] = useState([]);
const {students,loading}=useStudents()

  const getAttendance =async () => {
    try {
      const data = await docQr("Attendance",{
        max:400,
        whereClauses:[
          {
            field:"date",
            operator:"!=",
            value:""
          }
        ]
      });
      setAttendance(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }
  useEffect(() => {
    getAttendance()
  },[])

  const [attendanceHeader,setAttendanceHeader]=useState([])
  const getLast7DaysAttendance = async (attendance) => {
    try {
      // Step 1: Convert Firebase Timestamps to JS Dates
      const sorted = attendance
        .map((entry) => ({
          ...entry,
          dateObj: typeof entry.date === "string" ? new Date(entry.date) : entry.date.toDate(), // ✅ this is the fix
        }))
        .sort((a, b) => b.dateObj - a.dateObj); // latest first
  
      // Step 2: Get the first 7
      const top7 = sorted.slice(0, 8);
  
      // Step 3: Format dates
      const recentDates = top7.map((entry) =>
        entry.dateObj.toLocaleDateString("en-GB")
      );
  
      // console.log("Recent Dates:", recentDates);
      setAttendanceHeader(["Students Names",...recentDates]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load recent attendance.");
    }
  };
  

  useEffect(()=>{
    getLast7DaysAttendance(attendance)
  },[attendance])


  const [pagnitionState,setPagnitionState]=useState(0)
  const [pagnitionStateEnd,setPagnitionStateEnd]=useState(20)
  const [search,setSearch]=useState("")

  const studentsData = useMemo(() => {
    if (!attendanceHeader?.length || !attendance?.length || !students?.length) return [];
  
    return students.slice(pagnitionState,pagnitionStateEnd).map((student) => {
      const studentId = student.student_id;
  
      // Build attendance array for this student based on attendanceHeader
      let attendanceStatusPerDate = attendanceHeader.map((headerDate) => {
        // Try to find an attendance record for this student on this date
        const record = attendance.find((att) => {
          const attDate = typeof att.date === "string" ? new Date(att.date).toLocaleDateString("en-GB") : att.date.toDate().toLocaleDateString("en-GB"); // dd/MM/yyyy
          return attDate === headerDate && att.student_id === studentId;
        });
  
        // Return status or mark as "Absent" if none found
        return record ? "Present": record?.status || "Absent";
      });
      attendanceStatusPerDate.pop()
      return {
        name: student.display_name,
        avatar: student.photo_url,
        attendance: attendanceStatusPerDate,
      };
    });
  }, [attendanceHeader, attendance, students,pagnitionState,pagnitionStateEnd]);
  

  const studentFiletered=useMemo(()=>{
    if(!search)return studentsData
    return studentsData.filter((student) => student.name.toLowerCase().includes(search))
  },[studentsData,search]);

  return (
    <div>
      <Header />
      <div className="p-6 flex items-center justify-between">
        <p className="text-2xl font-bold">Attendance Records</p>
        <div className="inline-flex gap-6">
          <div className="inline-flex items-center gap-2 border cursor-pointer rounded-md p-2 text-xs">
            <GoDownload /> Export CSV
          </div>
          <div
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center font-bold gap-2 cursor-pointer rounded-md p-2 text-xs bg-[#0598ce] text-white"
          >
            <CiCirclePlus className="text-xl " />
            Take Attendance
          </div>

          {/* Attendance Modal (Conditional Rendering) */}

          {/* 🟢 Modal Overlay */}
          {isOpen && (
            <TakeAttendanceModal
              setIsModalOpen={setIsModalOpen}
              setIsOpen={setIsOpen}
            />
          )}
          {isModalOpen && (
            <TakeManuallyModal onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="p-6 border mx-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96 ">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              onChange={(e)=>{
                const {target:{value}}=e;
                setSearch(value);
              }}
              placeholder="Search"
              value={search}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-x-4">
            <div className="inline-flex items-center gap-2 border cursor-pointer rounded-md p-2 text-xs">
              Date <MdKeyboardArrowDown />
            </div>
            <div className="inline-flex items-center gap-2 border cursor-pointer rounded-md p-2 text-xs">
              Grade A <MdKeyboardArrowDown />
            </div>
            <div className="inline-flex items-center gap-2 border cursor-pointer rounded-md p-2 text-xs">
              English Subject <MdKeyboardArrowDown />
            </div>
          </div>
        </div>
        {loading && <ClipLoader size={28} />}

        <AttendanceTable studentsData={search ? studentFiletered:studentsData} attendanceHeader={attendanceHeader} />

        <Pagination setPagnitionState={setPagnitionState} setPagnitionStateEnd={setPagnitionStateEnd} />
      </div>
    </div>
  );
};

export default Attendance;
