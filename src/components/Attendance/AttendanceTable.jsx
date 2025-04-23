import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import Avatar from "../../assets/Avatar.png";
import { getCurrentWeekHeader, getLastWeekHeader } from "../../utils";

const attendanceConfig = {
  present: {
    color: "text-green-600 bg-green-100",
    icon: <FaCheckCircle className="text-green-600" />,
  },
  absent: {
    color: "text-red-600 bg-red-100",
    icon: <FaTimesCircle className="text-red-600" />,
  },
  excused: {
    color: "text-gray-600 bg-gray-100",
    icon: <FaExclamationCircle className="text-gray-600" />,
  },
};


const AttendanceTable = ({ studentsData, hooks }) => {
  // build header
  const attendanceHeader = hooks.weekHeader === "this_week" ? getCurrentWeekHeader() : getLastWeekHeader();
  attendanceHeader.unshift("STUDENT LIST");

  return (
    <div className="overflow-x-auto py-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#e3f4fa] text-left">
            {attendanceHeader.map((col, idx) => (
              <th 
                key={col + idx} 
                className={`p-3 ${idx === 0 ? "min-w-[250px] w-1/4" : "w-32"}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, rowIdx) => (
            <tr key={student.id} className="border-b">
              {/* Student info cell */}
              <td className="p-3 flex items-center space-x-5">
                <img
                  src={student.photo_url || Avatar}
                  alt={student.display_name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{student.display_name}</span>
              </td>

              {/* One cell per date in header (skip index 0) */}
              {attendanceHeader.slice(1).map((dateStr, colIdx) => {
                // find matching attendance record
                const rec = student.attendance.find((r) => {
                  let d;
                  if (r.date?.toDate) {
                    // Firestore Timestamp
                    d = r.date.toDate();
                  } else {
                    // plain object { seconds, nanoseconds }
                    d = new Date(r.date.seconds * 1000);
                  }
                  return d.toISOString().split("T")[0] === dateStr;
                });

                return (
                  <td key={colIdx} className="p-3 w-32">
                    {rec ? (
                      <span
                        className={`
                          px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1
                          ${attendanceConfig[rec?.status?.toLowerCase()]?.color}
                        `}
                      >
                        {attendanceConfig[rec?.status?.toLowerCase()]?.icon}
                        <span>{rec.status}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
