import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import Avatar from "../../assets/Avatar.png";
import { docQr } from "../../Logics/docQr_ORGate";



const attendanceConfig = {
  Present: {
    color: "text-green-600 bg-green-100",
    icon: <FaCheckCircle className="text-green-600" />,
  },
  Absent: {
    color: "text-red-600 bg-red-100",
    icon: <FaTimesCircle className="text-red-600" />,
  },
  Excused: {
    color: "text-gray-600 bg-gray-100",
    icon: <FaExclamationCircle className="text-gray-600" />,
  },
};

const AttendanceTable = ({attendanceHeader,studentsData}) => {
const students=studentsData;

  return (
    <div className="overflow-x-auto py-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#e3f4fa] text-left">
           {attendanceHeader.map((name,i)=>{

            return <th className="p-3" key={name+""+i}>{name}</th>
          })}
           
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b">
              <td className="p-3 flex items-center space-x-2">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{student.name}</span>
              </td>
              {student.attendance.map((status, idx) => (
                <td key={idx} className="p-3 w-32">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 ${attendanceConfig[status].color}`}
                  >
                    {attendanceConfig[status].icon}
                    <span>{status}</span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
