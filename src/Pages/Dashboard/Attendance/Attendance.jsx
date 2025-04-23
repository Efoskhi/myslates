import React, { useEffect, useMemo, useState } from "react";
import Header from "../../../components/Layout/Header";
import { GoDownload } from "react-icons/go";
import { CiCirclePlus } from "react-icons/ci";
import { MdFace, MdKeyboardArrowDown } from "react-icons/md";
import { FaSearch, FaUserEdit } from "react-icons/fa";
import TakeAttendanceModal from "../../../components/Attendance/TakeAttendanceModal";
import AttendanceTable from "../../../components/Attendance/AttendanceTable";
import TakeManuallyModal from "../../../components/Attendance/TakeManuallyModal";
import { docQr } from "../../../Logics/docQr_ORGate";
import toast from "react-hot-toast";
import useStudents from "../../../Hooks/useStudents";
import { format, subDays, isAfter, isBefore, parseISO, isWithinInterval, isEqual } from "date-fns";
import { ClipLoader } from "react-spinners";
import useAttendance from "../../../Hooks/useAttendance";
import Pagination from "../../../components/Layout/Pagination";
import FilterDropdown from "../../../components/Attendance/FilterDropdown";
import convertToCSV from "../../../utils/convertToCSV";
import { getCurrentWeekRange, getLastWeekRange } from "../../../utils";

const Attendance = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const hooks = useAttendance({ shouldGetAttendance: true })
  const { 
		studentAttendance,
    isLoadingStudents,
		pagination, 
    isAttendanceModalVisible,
    weekHeader,
    toggleAttendanceModalVisible,
    handlePaginate,
  } = hooks;

  const exportCSV = () => {
    // 1. Get current week header (e.g., Mon–Sun)
    const { dateFrom } = weekHeader === "this_week" ? getCurrentWeekRange() : getLastWeekRange();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(dateFrom);
      d.setDate(dateFrom.getDate() + i);
      return format(d, "yyyy-MM-dd");
    });
  
    // 2. Build data
    const dataForCSV = studentAttendance.map((student) => {
      const row = {
        Name: student.display_name,
        Email: student.email,
        StudentID: student.student_id,
        ParentEmail: student.parent_email,
      };
  
      // Add attendance status per week date
      weekDates.forEach((date) => {
        const attendanceForDate = student.attendance?.find((att) =>
          format(new Date(att.date.seconds * 1000), "yyyy-MM-dd") === date
        );
        row[date] = attendanceForDate?.status || "__"; // can be 'present', 'absent', etc.
      });
  
      return row;
    });
  
    // 3. Export to CSV
    convertToCSV(dataForCSV, "Weekly_Attendance.csv");
  };
  

  return (
    <div>
      <Header />
      <div className="p-6 flex items-center justify-between">
        <p className="text-2xl font-bold">Attendance Records</p>
        <div className="inline-flex gap-6">
          <div 
            onClick={exportCSV}
            className="inline-flex items-center gap-2 border cursor-pointer rounded-md p-2 text-xs"
          >
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
              toggleAttendanceModalVisible={toggleAttendanceModalVisible}
              setIsOpen={setIsOpen}
            />
          )}
          {isAttendanceModalVisible && (
            <TakeManuallyModal 
              onClose={toggleAttendanceModalVisible} 
              attendanceHooks={hooks}
            />
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
              // value={search}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <FilterDropdown hooks={hooks}/>
        </div>
        {isLoadingStudents && <ClipLoader size={28} />}

        <AttendanceTable 
          studentsData={studentAttendance} 
          hooks={hooks}
        />

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePaginate}
        />
      </div>
    </div>
  );
};

export default Attendance;
