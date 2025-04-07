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
//this completed calculate the student attendance
export default function AttendanceCalendar({ student }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);

  const getAttendance = async (student) => {
    try {
      const data = await docQr("Attendance", {
        max: 400,
        whereClauses: [
          { field: "student_id", operator: "==", value: student.student_id },
        ],
      });
      setAttendance(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (student) getAttendance(student);
  }, [student]);

  // All days in selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });

  // Build Present Days
  const presentDays = attendance
    .map((entry) => {
      const date = new Date(entry.date);
      return isSameMonth(date, selectedMonth) ? date.getDate() : null;
    })
    .filter((d) => d !== null);

  // Build Working Days (Mon–Fri & before today)
  const today = new Date();
  const workingDaysInMonth = daysInMonth
    .filter(
      (day) =>
        [1, 2, 3, 4, 5].includes(day.getDay()) && // Mon-Fri
        isBefore(day, today) // Ignore future days
    )
    .map((day) => day.getDate());

  // Absent = Working - Present
  const absentDays = workingDaysInMonth.filter(
    (day) => !presentDays.includes(day)
  );

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <div className="flex space-x-2">
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            onChange={(e) =>
              setSelectedMonth(
                new Date(selectedMonth.getFullYear(), e.target.value, 1)
              )
            }
            value={selectedMonth.getMonth()}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2024, i, 1), "MMMM")}
              </option>
            ))}
          </select>

          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option>Course</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-600 inline-block rounded-full mr-1"></span>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-300 inline-block rounded-full mr-1"></span>
          <span className="text-sm">Absent</span>
        </div>

        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-300 inline-block rounded-full mr-1"></span>
          <span className="text-sm">unknown</span>
        </div>
      </div>

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
          const isPresent = presentDays.includes(dayNum);
          const isAbsent = absentDays.includes(dayNum);

          return (
            <div
              key={dayNum}
              className={`p-3 rounded-md text-white font-semibold ${
                isPresent
                  ? "bg-blue-600"
                  : isAbsent
                  ? "bg-blue-300"
                  : "bg-gray-200"
              }`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
