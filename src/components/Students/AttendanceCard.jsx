import AttendanceCalendar from "./Attendance";
import SubjectAttendance from "./SubjectAttendance";
import useStudentAttendance from "../../Hooks/useStudentAttendance";
import useSubjects from "../../Hooks/useSubject";

const AttendanceCard = ({ student }) => {

    const hooks = useStudentAttendance(student);
    const { subjects } = useSubjects({ shouldGetSubjects: true })

    return (
        <>
            <AttendanceCalendar hooks={hooks} subjects={subjects}/>
            <SubjectAttendance hooks={hooks} subjects={subjects}/>
        </>
    )
}

export default AttendanceCard;