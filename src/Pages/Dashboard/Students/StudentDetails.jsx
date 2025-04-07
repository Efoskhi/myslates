import React, { useEffect, useState } from "react";
import Header from "../../../components/Layout/Header";
import StudentProfile from "../../../components/Students/StudentProfile";
import AttendanceCalendar from "../../../components/Students/Attendance";
import SubjectPerformance from "../../../components/Students/SubjectPerformance";
import SubjectAttendance from "../../../components/Students/SubjectAttendance";
import { useNavigate } from "react-router-dom";

const StudentDetails = () => {

  const [student, setStudent] = useState();

const navigate=useNavigate()
  useEffect(() => {
    (() => {
    const student = window.sessionStorage.getItem("student");
    console.log({student});
      if(student && student.includes("}")) setStudent(JSON.parse(student));
      else{
        navigate("/students");
      }
    })()
  },[])
  return (
    <div>
      <Header />
      <div className="bg-[#fcfeff] p-6">
        <div className="bg-white p-4 border grid gap-8 grid-cols-2">
          <div>
            <StudentProfile student={student} />
            <AttendanceCalendar student={student} />
          </div>
          <div>
            <SubjectPerformance student={student} />
            <SubjectAttendance student={student}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
