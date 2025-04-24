import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isBefore,
  isSameMonth,
} from "date-fns";
import { toast } from "react-hot-toast";
import { docQr } from "../../Logics/docQr_ORGate";
import { getMonthRange } from "../../utils";
import Loading from "../Layout/Loading";
//this completed calculate the student attendance
export default function AttendanceCalendar({ subjects, hooks }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { isLoading, filters, attendance, handleFilter } = hooks;

  // All days in selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });

  const handleFilterChange = (field, value) => {
    if(field === "month"){
      const { dateFrom } = getMonthRange(value)
      setSelectedMonth(dateFrom);
    }
    handleFilter(field, value)
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <div className="flex space-x-2">
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            onChange={e => handleFilterChange("month", e.target.value)}
            value={filters.month}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const currentYear = new Date().getFullYear();
              const monthName = format(new Date(currentYear, i, 1), "MMMM");
              return (
                <option key={i} value={monthName}>
                  {monthName}
                </option>
              );
            })}

          </select>

          <select 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm" 
            value={filters.subject}
            onChange={e => handleFilter("subject", e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((item, key) => (
              <option value={item.id} key={key}>{item.title.split("by")[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 inline-block rounded-full mr-1"></span>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 inline-block rounded-full mr-1"></span>
          <span className="text-sm">Absent</span>
        </div>

        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-400 inline-block rounded-full mr-1"></span>
          <span className="text-sm">Excused</span>
        </div>

        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-200 inline-block rounded-full mr-1"></span>
          <span className="text-sm">unknown</span>
        </div>
      </div>

      {isLoading && <Loading/>}

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["MON", "TUE", "WED", "THURS", "FRI", "SAT", "SUN"].map((day) => (
          <div key={day} className="text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}

        {/* Spacer */}
        {Array(getDay(startOfMonth(selectedMonth)))
          .fill(null)
          .map((_, i) => (
            <div key={i} className="p-3"></div>
          ))}

        {/* Calendar Days */}
        {daysInMonth.map((day) => {
          const dayNum = day.getDate();

          // Format current day to YYYY-MM-DD for easier comparison
          const formattedDay = day.toISOString().split("T")[0];

          // Find matching attendance record for the current day
          const attendanceForDay = attendance.find((a) => {
            const attendanceDate = new Date(a.date.seconds * 1000);
            const formattedAttendanceDate = attendanceDate.toISOString().split("T")[0];
            return formattedAttendanceDate === formattedDay;
          });

          const status = attendanceForDay?.status;

          let bgColor = "bg-gray-200";
          if (status === "present") bgColor = "bg-green-500";
          else if (status === "absent") bgColor = "bg-red-500";
          else if (status === "excused") bgColor = "bg-yellow-400";

          return (
            <div
              key={dayNum}
              className={`p-3 rounded-md text-white font-semibold ${bgColor}`}
            >
              {dayNum}
            </div>
          );
        })}

      </div>
    </div>
  );
}
